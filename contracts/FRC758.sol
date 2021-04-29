//SPDX-License-Identifier: ChaingeFinance
pragma solidity = 0.7.6;

import "./Controllable.sol";
import "./libraries/SafeMath256.sol";
import "./interfaces/ITimeSlicedTokenReceiver.sol";
import "./interfaces/IFRC758.sol";

import "@nomiclabs/buidler/console.sol";

abstract contract FRC758 is IFRC758 {
    string internal name_;
    string internal symbol_;
    uint256 internal decimals_;

    constructor(string memory _name, string memory _symbol, uint256 _decimals) {
        name_ = _name;
        symbol_ = _symbol;
        decimals_ = _decimals;
    }
    function name() public view override returns (string memory) {
        return name_;
    }
    function symbol() public view override returns (string memory) {
        return symbol_;
    }
    function decimals() public view override returns (uint256) {
        return decimals_;
    }
    using SafeMath256 for uint256;
    // Equals to `bytes4(keccak256("onTimeSlicedTokenReceived(address,address,uint256,uint256,uint256,bytes)"))`
    bytes4 private constant _TIMESLICEDTOKEN_RECEIVED = 0xb005a606;
	uint256 public constant MAX_TIME = 18446744073709551615;
    
    struct SlicedToken {
        uint256 amount;
        uint256 tokenStart;
        uint256 tokenEnd;
        uint256 next;
    }
    
    mapping (address => mapping (uint256 => SlicedToken)) internal balances;

    mapping (address => uint256) internal balance;
    
    mapping (address => uint256) internal ownedSlicedTokensCount;

    mapping (address => mapping (address => bool)) internal operatorApprovals;

    uint256 public totalSupply;

    mapping (address => uint256 ) headerIndex;

    function _checkRights(bool _has) internal pure {
        require(_has, "no rights to manage");
    }

    function _validateAddress(address _addr) internal  pure {
        require(_addr != address(0), "invalid address");
    }
    
    function _validateAmount(uint256 amount) internal pure {
        require(amount > 0, "invalid amount");
    }

    function _validateTokenStartAndEnd(uint256 tokenStart, uint256 tokenEnd) internal view {
        require(tokenStart < tokenEnd, "FRC758: tokenStart can't be greater than tokenEnd");
	    require(tokenEnd >= block.timestamp || tokenEnd <= MAX_TIME, "FRC758: tokenEnd can't be greater than MAX_TIME or less than blocktime");
    }

    function sliceOf(address from) public view override returns (uint256[] memory, uint256[] memory, uint256[] memory) {
        _validateAddress(from);
        uint256 header = headerIndex[from];
        if(header == 0 &&  balance[from] == 0) {
            return (new uint256[](0), new uint256[](0), new uint256[](0));
        }
        uint256 count = ownedSlicedTokensCount[from];

        uint256[] memory amountArray = new uint256[](count+1);
        uint256[] memory tokenStartArray = new uint256[](count+1);
        uint256[] memory tokenEndArray = new uint256[](count +1);
        
        amountArray[0] = balance[from];
        tokenStartArray[0] = 0;
        tokenEndArray[0] = MAX_TIME;
        
        for (uint256 ii = 0; ii < count; ii++) {
            amountArray[ii+1] = balances[from][ii +1].amount;
            tokenStartArray[ii+1] = balances[from][ii+1].tokenStart;
            tokenEndArray[ii+1] = balances[from][ii+1].tokenEnd;
        }

        return (amountArray, tokenStartArray, tokenEndArray);
    }

    function timeBalanceOf(address from, uint256 tokenStart, uint256 tokenEnd) public override view returns(uint256) {
        console.log('rrrrrrrrrrrrrrrr', tokenStart, tokenEnd);
		if (tokenStart >= tokenEnd) {
            console.log('aaaaaaaaa');
           return 0;
		}
		uint256 next = headerIndex[from];
		if(next == 0) {
           return 0;
		}
		uint256 amount = 0;   
		while(next > 0) {
		SlicedToken memory st = balances[from][next];
        console.log(next);
          console.log('eeeeeeeeeee', st.tokenStart, st.tokenEnd, st.amount);
            if( tokenStart < st.tokenStart || (st.next == 0 && tokenEnd > st.tokenEnd)) {
				amount = 0;
				break;
            }
            if( tokenStart >= st.tokenEnd ) {
                next = st.next;
                continue;
            }
            if(st.amount == 0 ) {
                amount = 0;
                break;
            }
            if(amount == 0 || amount > st.amount) {
                amount =  st.amount;
            }
            if(tokenEnd <= st.tokenEnd) {
                break;
            }
            tokenStart = st.tokenEnd;
            next = st.next;
        }
        return amount;
    }

    function setApprovalForAll(address _spender, bool _approved) public override {
        require(_spender != msg.sender, "FRC758: wrong approval destination");
        operatorApprovals[msg.sender][_spender] = _approved;
        emit ApprovalForAll(msg.sender, _spender, _approved);
    }

    function isApprovedForAll(address _owner, address _spender) public view override returns (bool) {
        return operatorApprovals[_owner][_spender];
    }

    function isApprovedOrOwner(address _spender, address _from) public view returns (bool) {
        return _spender == _from || isApprovedForAll(_from, _spender);
    }

   function transferFrom(address sender, address _recipient, uint256 amount) public override returns (bool) { 
        _validateAddress(sender);
        _validateAddress(_recipient);
        _validateAmount(amount);
        _checkRights(isApprovedOrOwner(msg.sender, sender));
        if(amount <= balance[sender]) {
            balance[sender] = balance[sender].sub(amount);
            balance[_recipient] = balance[_recipient].add(amount);
            return true;
        }

        uint256 _amount = amount.sub(balance[sender]);        
        balance[sender] = 0;

        SlicedToken memory st = SlicedToken({amount: _amount, tokenStart: block.timestamp, tokenEnd: MAX_TIME, next: 0});
        _subSliceFromBalance(sender, st);

        balance[_recipient] = balance[_recipient].add(amount);

        return true;
    }
    
    function timeSliceTransferFrom(address _from, address _to, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public override {
        _validateAddress(_from);
        _validateAddress(_to);
        _validateAmount(amount);
        _checkRights(isApprovedOrOwner(msg.sender, _from));
        require(_from != _to, "FRC758: can not send to yourself");

        if(tokenStart < block.timestamp) tokenStart = block.timestamp;

        require(tokenStart < tokenEnd, "FRC758: tokenStart>=tokenEnd");

        uint256 timeBalance = timeBalanceOf(_from, tokenStart, tokenEnd); 
        console.log('checkout Balance', tokenStart, tokenEnd, timeBalance);

        if(amount <= timeBalance) {
            console.log('sub of', tokenStart, tokenEnd);
            SlicedToken memory st = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
            _subSliceFromBalance(_from, st);
            _addSliceToBalance(_to, st);
            return;
        }

        uint256 _amount = amount.sub(timeBalance); 

        if(timeBalance != 0) {
            SlicedToken memory st = SlicedToken({amount: timeBalance, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0}); 
            _subSliceFromBalance(_from, st);  
        }

        balance[_from] = balance[_from].sub(_amount); 

        change(_from, _amount, tokenStart, tokenEnd);

        if(tokenStart <= block.timestamp && tokenEnd == MAX_TIME) {
             balance[_to] = balance[_to].add(amount);
             return;
        }
        SlicedToken memory toSt = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
        _addSliceToBalance(_to, toSt); 
        
        emit Transfer(_from, _to, amount, tokenStart, tokenEnd);
    }

    function change(address _from, uint256 _amount, uint256 tokenStart, uint256 tokenEnd) internal {
        if(tokenStart > block.timestamp) {
              SlicedToken memory leftSt = SlicedToken({amount: _amount, tokenStart: block.timestamp, tokenEnd: tokenStart, next: 0});
             _addSliceToBalance(_from, leftSt);
        }
        if(tokenEnd < MAX_TIME) {
            if(tokenEnd < block.timestamp) tokenEnd =  block.timestamp;
            SlicedToken memory rightSt = SlicedToken({amount: _amount, tokenStart: tokenEnd, tokenEnd: MAX_TIME, next: 0});
            _addSliceToBalance(_from, rightSt); 
        }
    }

    function _mint(address _from, uint256 amount) internal {
        _validateAddress(_from);
        _validateAmount(amount);
        balance[_from] = balance[_from].add(amount);
        emit Transfer(address(0), _from, amount, 0, MAX_TIME);
    }

    function _burn(address _from, uint256 amount) internal {
        _validateAddress(_from);
        _validateAmount(amount);
         balance[_from] = balance[_from].sub(amount);
        emit Transfer(_from, address(0), amount, 0, MAX_TIME);
    }

    function _mintSlice(address _from,  uint256 amount, uint256 tokenStart, uint256 tokenEnd) internal {
        _validateAddress(_from);
        _validateAmount(amount);
        SlicedToken memory st = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
        _addSliceToBalance(_from, st);
        emit Transfer(address(0), _from, amount, 0, MAX_TIME);
    }

    function _burnSlice(address _from, uint256 amount, uint256 tokenStart, uint256 tokenEnd) internal {
        _validateAddress(_from);
        _validateAmount(amount);
        SlicedToken memory st = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
        _subSliceFromBalance(_from, st);
        emit Transfer(_from, address(0), amount, tokenStart, tokenEnd);
    }

    function _addSliceToBalance(address addr, SlicedToken memory st) internal {
        uint256 count = ownedSlicedTokensCount[addr];
        if(count == 0) {
             balances[addr][1] = st;
             ownedSlicedTokensCount[addr] = 1;
             headerIndex[addr] = 1;
             return;
        }

        if(st.tokenStart >= st.tokenEnd) {
            return;
        }
        
        uint256 current = headerIndex[addr];
        do {
            SlicedToken storage currSt = balances[addr][current];
            if(st.tokenStart >= currSt.tokenEnd && currSt.next != 0 ) {
                current = currSt.next;
                continue;
            }
    
            if (currSt.tokenStart >= st.tokenEnd) {
                uint256 index = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount, current);
                if(current == headerIndex[addr]) {
                    headerIndex[addr] = index; 
                }
                return;
            }

            if(currSt.tokenStart < st.tokenEnd && currSt.tokenStart > st.tokenStart) {
                uint256 index = _addSlice(addr, st.tokenStart, currSt.tokenStart, st.amount, current);
                if(current == headerIndex[addr]) {
                    headerIndex[addr] = index;  
                }else {
                    uint256 _current = headerIndex[addr];
                    while(_current>0) {
                        if(balances[addr][_current].next == current)  {
                            balances[addr][_current].next = index;
                            break;
                        }
                        _current = balances[addr][_current].next;
                    }
                }
                st.tokenStart = currSt.tokenStart;
                continue;
            }
            if(currSt.tokenStart == st.tokenStart && currSt.tokenEnd == st.tokenEnd) { 
                _mergeAmount(currSt, st.amount);
                return;
            }
            if(currSt.tokenEnd >= st.tokenEnd) {  
                if(currSt.tokenStart < st.tokenStart) {
                    uint256 currStEndTime = currSt.tokenEnd ;
                    uint256 currStNext = currSt.next;
                    currSt.tokenEnd = st.tokenStart;
                    uint256 innerIndex = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount + currSt.amount, 0);
                    currSt.next = innerIndex;
                    if(currStEndTime > st.tokenEnd) {
                        uint256 rightIndex = _addSlice(addr, st.tokenEnd, currStEndTime, currSt.amount, currStNext);
                        balances[addr][innerIndex].next = rightIndex;
                    }
 
                    return;
                }
                 uint256 currStTokenEnd =  currSt.tokenEnd;
                 uint256 currStAmount = currSt.amount;
                if(currSt.tokenStart == st.tokenStart) {
                    currSt.tokenEnd = st.tokenEnd;
                    _mergeAmount(currSt, st.amount);
                    uint256 index = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmount, currSt.next);
                    currSt.next = index;
                    return;
                }
            }
            if(currSt.tokenEnd > st.tokenStart) {
                  uint256 currStTokenEnd = currSt.tokenEnd;
                  if (currSt.tokenStart < st.tokenStart) {
                    currSt.tokenEnd = st.tokenStart; 
                    uint256 index = _addSlice(addr, st.tokenStart, currStTokenEnd, currSt.amount + st.amount, currSt.next);
                    currSt.next = index;
                    st.tokenStart = currStTokenEnd;
                    current = currSt.next;
                    if(current != 0) {
                        continue;
                    }
                  }
    
                  currSt.tokenStart = st.tokenStart;
                  _mergeAmount(currSt, st.amount);
                  current = currSt.next;
                  if(current != 0) {
                    st.tokenStart = currSt.tokenEnd;
                    continue;
                  }

                st.tokenStart = currSt.tokenEnd;
                balances[addr][ownedSlicedTokensCount[addr] +1] = st;
                currSt.next = ownedSlicedTokensCount[addr] +1;
                ownedSlicedTokensCount[addr] += 1;
                return;
            }

            if(currSt.next == 0 && currSt.tokenEnd <= st.tokenStart) {
                uint256 index = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount, 0);
                currSt.next = index;
                return;
            }
            current = currSt.next;
        }while(current > 0);
    } 

    function _mergeAmount(SlicedToken storage currSt, uint256 amount) internal {
        currSt.amount += amount;
    }

    function _addSlice(address addr, uint256 tokenStart, uint256 tokenEnd, uint256 amount, uint256 next) internal returns (uint256) {
         balances[addr][ownedSlicedTokensCount[addr] +1] = SlicedToken({amount: amount , tokenStart: tokenStart, tokenEnd: tokenEnd, next: next});
         ownedSlicedTokensCount[addr] += 1;
         return ownedSlicedTokensCount[addr];
    }    
    function _subSliceFromBalance(address addr, SlicedToken memory st) internal {
        uint256 count = ownedSlicedTokensCount[addr];

		require(count != 0, 'Empty slice items');

        uint256 current = headerIndex[addr];
    
        do {
            SlicedToken storage currSt = balances[addr][current]; 
            console.log('start sub Slice!!!!************************', st.tokenStart, st.tokenEnd, currSt.tokenStart);
            if(currSt.tokenEnd < block.timestamp) { 
                 console.log('this this this!');
                headerIndex[addr] = currSt.next; 
                current = currSt.next;
                continue;
            }

            require(st.amount <= currSt.amount, 'FRC758: insufficient balance');
            require(currSt.tokenStart < st.tokenEnd, 'FRC758: subSlice time check fail point 1');
            require(!(currSt.next == 0 && currSt.tokenEnd < st.tokenEnd), 'FRC758: subSlice time check fail point 2');
            require(!(currSt.tokenStart < st.tokenEnd && currSt.tokenStart > st.tokenStart), 'FRC758: subSlice time check fail point 3');

            console.log(currSt.tokenStart == st.tokenStart, currSt.tokenEnd == st.tokenEnd);
            if(currSt.tokenStart == st.tokenStart && currSt.tokenEnd == st.tokenEnd) {
                console.log(currSt.amount);
                currSt.amount -= st.amount;
                console.log(currSt.amount);
                return;
            }

            if(currSt.tokenStart == st.tokenStart ) {
                if(currSt.tokenEnd > st.tokenEnd) {
                    uint256 currStAmount = currSt.amount;
                    currSt.amount -= st.amount;
                    uint256 currStTokenEnd = currSt.tokenEnd;
                    currSt.tokenEnd = st.tokenEnd;
                    uint256 index0 = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmount,  currSt.next);
                    currSt.next = index0;
                    break;
                }
                currSt.amount -= st.amount;
                st.tokenStart = currSt.tokenEnd;
                current = currSt.next;
                continue;
            }

            if(currSt.tokenStart < st.tokenStart ) { 
                uint256 index1 = _addSlice(addr, currSt.tokenStart, st.tokenStart, currSt.amount, current);
                console.log('<<<<<<<<', currSt.amount);
                console.log(current, headerIndex[addr], index1);
                if(current == headerIndex[addr]) { 
                    headerIndex[addr] = index1; 
                }else {
                    uint256 _current = headerIndex[addr];
                    while(_current > 0) {
                        if(balances[addr][_current].next == current)  {
                            balances[addr][_current].next = index1;
                            break;
                        }
                        _current = balances[addr][_current].next;
                    }
                }

                uint256 currStAmunt = currSt.amount;
                uint256 currStTokenEnd = currSt.tokenEnd;
                currSt.amount -= st.amount;
                currSt.tokenStart = st.tokenStart;
                // currSt.tokenEnd = st.tokenEnd;

                if(currStTokenEnd >= st.tokenEnd) {
                    if(currStTokenEnd > st.tokenEnd) {
                         currSt.tokenEnd = st.tokenEnd;
                         uint256 index2 = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmunt, currSt.next);
                         currSt.next = index2;
                    }
                    break; 
                }
                st.tokenStart = currStTokenEnd;
            }
            current = currSt.next;
        }while(current>0);
    }

    function _clean(address from, uint256 tokenStart, uint256 tokenEnd) internal {
        uint256 minBalance = timeBalanceOf(from, tokenStart, tokenEnd);
		uint256 firstDeletedIndex = 0;
        uint256 lastIndex = 0;
        uint256 _tokenStart = tokenStart;
		uint256 next = headerIndex[from];

		while(next > 0) {
		    SlicedToken memory st = balances[from][next];

            if(tokenEnd < st.tokenStart) {
                lastIndex = next;
                break;
            }

            if(tokenStart >= st.tokenEnd || tokenEnd <= st.tokenStart) {
                lastIndex = next;
                next = st.next;
                continue;
            }

            delete balances[from][next];
            if(firstDeletedIndex == 0) {
                firstDeletedIndex = next; 
            }

            tokenStart = st.tokenEnd;
            lastIndex = next;
            next = st.next;
        }

        if(firstDeletedIndex != 0 && firstDeletedIndex != lastIndex) { // move last to first
             balances[from][firstDeletedIndex] = balances[from][lastIndex];
             delete balances[from][lastIndex];
        }

        if(minBalance > 0) {
            _mintSlice(from, minBalance, _tokenStart, tokenEnd);  
        }  
    }
}