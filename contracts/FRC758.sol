//SPDX-License-Identifier: Unlicense
pragma solidity =0.7.6;

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
    
    uint256 public constant MAX_UINT = 2**256 - 1;

    uint256 public constant MAX_TIME = 18446744073709551615;
    
    struct SlicedToken {
        uint256 amount; //token amount
        uint256 tokenStart; //token start blockNumber or timestamp (in secs from unix epoch)
        uint256 tokenEnd; //token end blockNumber or timestamp, use MAX_UINT for timestamp, MAX_BLOCKNUMBER for blockNumber.
        uint256 next;
    }
    
    // Mapping from owner to a map of SlicedToken
    mapping (address => mapping (uint256 => SlicedToken)) internal balances;
    
    // Mapping from owner to number of SlicedToken struct（record length of balances）
    mapping (address => uint256) internal ownedSlicedTokensCount;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) internal operatorApprovals;
    
    uint256 internal _totalSupply;

    mapping (address => uint256 ) headerIndex;

    function _checkRights(bool _has) internal pure {
        require(_has, "no rights to manage");
    }

    //address should be non-zero
    function _validateAddress(address _addr) internal  pure {
        require(_addr != address(0), "invalid address");
    }
    
    //amount should be greater than 0
    function _validateAmount(uint256 amount) internal pure {
        require(amount > 0, "invalid amount");
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    //validate tokenStart and tokenEnd
    function _validateTokenStartAndEnd(uint256 tokenStart, uint256 tokenEnd) internal view {
        require(tokenEnd >= tokenStart, "tokenStart greater than tokenEnd");
        require((tokenEnd >= block.timestamp) || (tokenEnd >= block.number), "blockEnd less than current blockNumber or timestamp");
    }

    function sliceOf(address from) public view override returns (uint256[] memory, uint256[] memory, uint256[] memory) {
        _validateAddress(from);
       uint header = headerIndex[from];
       if(header == 0) {
           return (new uint256[](0), new uint256[](0), new uint256[](0));
       }
        uint256 count = 0;
     
        while(header > 0) {
                SlicedToken memory st = balances[from][header];
                if(block.timestamp < st.tokenEnd) {
                    count++;
                }
                header = st.next;
        }
        uint256 allCount = ownedSlicedTokensCount[from];
        uint256[] memory amountArray = new uint256[](count);
        uint256[] memory tokenStartArray = new uint256[](count);
        uint256[] memory tokenEndArray = new uint256[](count);
        
        uint256 i = 0;
        for (uint256 ii = 1; ii < allCount+1; ii++) {
            if(block.timestamp >= balances[from][ii].tokenEnd) {
               continue;
            }
            amountArray[i] = balances[from][ii].amount;
            tokenStartArray[i] = balances[from][ii].tokenStart;
            tokenEndArray[i] = balances[from][ii].tokenEnd;
            i++;
        }
        
        return (amountArray, tokenStartArray, tokenEndArray);
    }

    function timeBalanceOf(address from, uint256 tokenStart, uint256 tokenEnd) public override view returns(uint256) {
       if (tokenStart >= tokenEnd) {
           return 0;
       }
       uint256 next = headerIndex[from];
       if(next == 0) {
           return 0;
       }
       uint256 amount = 0;   
        while(next > 0) {
                SlicedToken memory st = balances[from][next];
                if( tokenStart < st.tokenStart || (st.next == 0 && tokenEnd > st.tokenEnd)) {
                    amount = 0;
                    break;
                }
                if(tokenStart >= st.tokenEnd) {
                    next = st.next;
                    continue;
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


    function setApprovalForAll(address _to, bool _approved) public override {
        require(_to != msg.sender, "wrong approval destination");
        operatorApprovals[msg.sender][_to] = _approved;
        emit ApprovalForAll(msg.sender, _to, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) public view override returns (bool) {
        return operatorApprovals[_owner][_operator];
    }

    //the _spender is trying to spend assets from _from
    function isApprovedOrOwner(address _spender, address _from) public view returns (bool) {
        return _spender == _from || isApprovedForAll(_from, _spender);
    }

    // function transferFrom(address _from, address _to, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public override {
    //     _validateAddress(_from);
    //     _validateAddress(_to);
    //     _validateAmount(amount);
    //     _checkRights(isApprovedOrOwner(msg.sender, _from));
    //     require(_from != _to, "no sending to yourself");

    //     SlicedToken memory st = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
    //     _subSliceFromBalance(_from, st);
    //     _addSliceToBalance(_to, st);
    //     emit Transfer(_from, _to, amount, tokenStart, tokenEnd);
    // }


    function safeTransferFrom(address _from, address _to, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public override {
		require(checkAndCallSafeTransfer(_from, _to, amount, tokenStart, tokenEnd), "can't make safe transfer");
        _validateAddress(_from);
        _validateAddress(_to);
        _validateAmount(amount);
        _checkRights(isApprovedOrOwner(msg.sender, _from));
        require(_from != _to, "no sending to yourself");

        SlicedToken memory st = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
        _subSliceFromBalance(_from, st);
        _addSliceToBalance(_to, st);
        emit Transfer(_from, _to, amount, tokenStart, tokenEnd);
    }

    function _mint(address _from,  uint256 amount, uint256 tokenStart, uint256 tokenEnd) internal {
         console.log('start', gasleft());
        _validateAddress(_from);
        _validateAmount(amount);
        SlicedToken memory st = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
        _addSliceToBalance(_from, st);
         console.log('end', gasleft());
        emit Transfer(address(0), _from, amount, tokenStart, tokenEnd);
    }

    function _burn(address _from, uint256 amount, uint256 tokenStart, uint256 tokenEnd) internal {
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

        uint256 current = headerIndex[addr];
               
        do {
            SlicedToken storage currSt = balances[addr][current];
            if(st.tokenStart >= currSt.tokenEnd && currSt.next != 0 ) {
                current = currSt.next;
                continue;
            }
            console.log('0', gasleft());
    
            if (currSt.tokenStart >= st.tokenEnd) {
                uint256 index = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount, current);
                if(current == headerIndex[addr]) {
                    headerIndex[addr] = index; 
                }
                return;
            }
            console.log('1', gasleft());

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
            console.log('2', gasleft());
            if(currSt.tokenStart == st.tokenStart && currSt.tokenEnd == st.tokenEnd) { 
                _mergeAmount(currSt, st.amount);
                return;
            }
            console.log('3', gasleft());
            if(currSt.tokenEnd >= st.tokenEnd) {  
                if(currSt.tokenStart < st.tokenStart) {
                    uint256 currStEndTime = currSt.tokenEnd ;
                    uint256 currStNext = currSt.next;
                    currSt.tokenEnd = st.tokenStart;
                    console.log('3.5', gasleft());
                    uint256 innerIndex = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount + currSt.amount, 0);
                    currSt.next = innerIndex;
                      console.log('3.6', gasleft(), currStEndTime > st.tokenEnd);
                    if(currStEndTime > st.tokenEnd) {
                        uint256 rightIndex = _addSlice(addr, st.tokenEnd, currStEndTime, currSt.amount, currStNext);
                        balances[addr][innerIndex].next = rightIndex;
                    }
                    console.log('3.7', gasleft());
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
            console.log('4', gasleft());
            if( currSt.tokenEnd > st.tokenStart && currSt.tokenEnd >= st.tokenStart) {
                  uint256 currStTokenEnd = currSt.tokenEnd;
                  if(currSt.tokenStart < st.tokenStart) {
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
            console.log('5', gasleft());
            if(currSt.next == 0 && currSt.tokenEnd <= st.tokenStart) {
                uint256 index = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount, 0);
                currSt.next = index;
                return;
            }
            console.log('6', gasleft());
            current = currSt.next;
        }while(current>0);
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

        if(count == 0) {
            revert();
        }

        uint256 current = headerIndex[addr];
        do {
            SlicedToken storage currSt = balances[addr][current]; 

            if(currSt.tokenEnd < block.timestamp) { 
                headerIndex[addr] = currSt.next; 
                current = currSt.next;
                continue;
            }
            if(st.amount > currSt.amount) {
                revert();
            }

            if (currSt.tokenStart >= st.tokenEnd) { 
                 revert();
            }
            if(currSt.next == 0 && currSt.tokenEnd < st.tokenEnd) { 
                 revert();
            }

            if(currSt.tokenStart < st.tokenEnd && currSt.tokenStart > st.tokenStart) { 
                revert();
            }

            if(currSt.tokenStart == st.tokenStart && currSt.tokenEnd == st.tokenEnd) {
                currSt.amount -= st.amount;
                return;
            }

            if(currSt.tokenStart == st.tokenStart ) {
                if(currSt.tokenEnd > st.tokenEnd) {
                    uint256 currStAmount = currSt.amount;
                    currSt.amount -= st.amount;
                    uint256 currStTokenEnd = currSt.tokenEnd;
                    currSt.tokenEnd = st.tokenEnd;
                    uint256 index = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmount,  currSt.next);
                    currSt.next = index;
                    break;
                }
                currSt.amount -= st.amount;
                st.tokenStart = currSt.tokenEnd;
                current = currSt.next;
                continue;
            }

            if(currSt.tokenStart < st.tokenStart ) { 
                uint256 index = _addSlice(addr, currSt.tokenStart, st.tokenStart, currSt.amount, current);
                if(current == headerIndex[addr]) { 
                    headerIndex[addr] = index; 
                }else {
                    
                    uint256 _current = headerIndex[addr];
                    while(_current > 0) {
                        if(balances[addr][_current].next == current)  {
                            balances[addr][_current].next = index;
                            break;
                        }
                        _current = balances[addr][_current].next;
                    }
                }

                uint256 currStAmunt = currSt.amount;
                uint256 currStTokenEnd = currSt.tokenEnd;
                currSt.amount -= st.amount;
                currSt.tokenStart = st.tokenStart;

                if(currStTokenEnd >= st.tokenEnd) {
                    if(currStTokenEnd > st.tokenEnd) {
                         uint256 index = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmunt, currSt.next);
                         currSt.next = index;
                    }
                    break; 
                }
                st.tokenStart = currStTokenEnd;
            }
            current = currSt.next;
        }while(current>0);
    }

    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }    

    function checkAndCallSafeTransfer(address _from, address _to, uint256 amount, uint256 tokenStart, uint256 tokenEnd) internal returns (bool) {
        if (!_isContract(_to)) {
            return true;
        }
        bytes4 retval = ITimeSlicedTokenReceiver(_to).onTimeSlicedTokenReceived(msg.sender, _from, amount, tokenStart, tokenEnd);
        return (retval == _TIMESLICEDTOKEN_RECEIVED);
    }
}
