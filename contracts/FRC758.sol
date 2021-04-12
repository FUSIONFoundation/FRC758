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

    uint256 public constant MAX_TIME = 666666666666;
    
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

    mapping (address => uint256 ) headerIndex; // 切片的索引

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


    function sliceOf(address _owner) public view override returns (uint256[] memory, uint256[] memory, uint256[] memory) {
        _validateAddress(_owner);
        uint256 count = ownedSlicedTokensCount[_owner];
        //SlicedToken[] memory tokens = new SlicedToken[](count);
        
        uint256[] memory amountArray = new uint256[](count);
        uint256[] memory tokenStartArray = new uint256[](count);
        uint256[] memory tokenEndArray = new uint256[](count);
        
        for (uint256 ii = 0; ii < count; ii++) {
            amountArray[ii] = balances[_owner][ii].amount;
            tokenStartArray[ii] = balances[_owner][ii].tokenStart;
            tokenEndArray[ii] = balances[_owner][ii].tokenEnd;
        }
        
        return (amountArray, tokenStartArray, tokenEndArray);
    }

    function balanceOf(address from, uint256 tokenStart, uint256 tokenEnd) public override view returns(uint256) {
       if (tokenStart >= tokenEnd) {
           return 0;
       }
       uint next = headerIndex[from];
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

    function transferFrom(address _from, address _to, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public override {
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


    function safeTransferFrom(address _from, address _to, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public override {
        transferFrom(_from, _to, amount, tokenStart, tokenEnd);
        require(checkAndCallSafeTransfer(_from, _to, amount, tokenStart, tokenEnd), "can't make safe transfer");
    }

    function _mint(address _from,  uint256 amount, uint256 tokenStart, uint256 tokenEnd) internal {
        _validateAddress(_from);
        _validateAmount(amount);
        SlicedToken memory st = SlicedToken({amount: amount, tokenStart: tokenStart, tokenEnd: tokenEnd, next: 0});
        _addSliceToBalance(_from, st);
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

        uint current = headerIndex[addr];
               
        do {
            SlicedToken storage currSt = balances[addr][current];
            if(st.tokenStart >= currSt.tokenEnd && currSt.next != 0 ) {
                current = currSt.next;
                continue;
            }
    
            if (currSt.tokenStart >= st.tokenEnd) {
               console.log('bef all out');
                uint256 index = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount, current);
                if(current == headerIndex[addr]) {
                    headerIndex[addr] = index; 
                }
                return;
            }

            if(currSt.tokenStart < st.tokenEnd && currSt.tokenStart > st.tokenStart) {
                        console.log('bef out');

                uint index = _addSlice(addr, st.tokenStart, currSt.tokenStart, st.amount, current);
                if(current == headerIndex[addr]) {
                    headerIndex[addr] = index;  
                }else {
                    uint _current = headerIndex[addr];
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
                    uint currStEndTime = currSt.tokenEnd ;
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
                    uint index = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmount, currSt.next);
                    currSt.next = index;
                    return;
                }
            }
            if( currSt.tokenEnd > st.tokenStart && currSt.tokenEnd >= st.tokenStart) {
                console.log('aft out');
                  uint256 currStTokenEnd = currSt.tokenEnd;
                  if(currSt.tokenStart < st.tokenStart) {
                    currSt.tokenEnd = st.tokenStart; 
                    uint index = _addSlice(addr, st.tokenStart, currStTokenEnd, currSt.amount + st.amount, currSt.next);
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
                console.log( ownedSlicedTokensCount[addr] );
                console.log('aft all out', st.tokenStart, st.tokenEnd, st.amount);
                uint index = _addSlice(addr, st.tokenStart, st.tokenEnd, st.amount, 0);
                currSt.next = index;
                return;
            }

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

        // 空账户
        if(count == 0) {
            revert();
        }

        // 遍历链表
        uint current = headerIndex[addr];
        do {
            SlicedToken storage currSt = balances[addr][current]; // 表头的第一个元素

            // if(currSt.tokenEnd < block.timestamp) { // 清除过期的片 , 只需要重置链表头为下一个元素
            //     headerIndex[addr] = currSt.next; 
            //     continue;
            // }
            if(st.amount > currSt.amount) {
                console.log('currSt.next == 0 && currSt.tokenEnd <= st.tokenEnd');
                revert();
            }

            // console.log('nnnnnnnn', st.tokenStart, st.tokenEnd, st.amount);
            if(currSt.tokenStart == st.tokenStart && currSt.tokenEnd == st.tokenEnd) { // 恰好匹配，不需要切片，直接减去数量搞定退出

                currSt.amount -= st.amount;
                // balances[addr][ownedSlicedTokensCount[addr]]  = currSt; //前段
                // balances[addr][ownedSlicedTokensCount[addr]].amount -= st.amount;
                // ownedSlicedTokensCount[addr] += 1;
                return;
            }
            if (currSt.tokenStart >= st.tokenEnd) { // 只要左边全部超过了，肯定是不合法的啊
                console.log('currSt.tokenStart >= st.tokenEnd');
                 revert();
            }
            console.log("aaaaaa",currSt.next , currSt.tokenEnd < st.tokenEnd );
            if(currSt.next == 0 && currSt.tokenEnd < st.tokenEnd) { // 最后一个的右边超过了
             console.log('currSt.next == 0 && currSt.tokenEnd <= st.tokenEnd');
                 revert();
            }

            // 不管是不是第一个。左相交都是不合法的, 因为之后的是被切过的，不可能存在左相交。
            if(currSt.tokenStart < st.tokenEnd && currSt.tokenStart > st.tokenStart) { // 左相交 合并完 合并完 rightSlice  赋值 给st 跟下一个元素匹配
                console.log('currSt.next == 0 && currSt.tokenEnd <= st.tokenEnd');
                revert();
            }

            if(currSt.tokenStart == st.tokenStart ) {
                if(currSt.tokenEnd > st.tokenEnd) { // 切两段然后结束
                    uint256 currStAmount = currSt.amount;
                    currSt.amount -= st.amount;
                    uint256 currStTokenEnd = currSt.tokenEnd;
                    currSt.tokenEnd = st.tokenEnd;
                    uint256 index = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmount,  currSt.next);
                    currSt.next = index;
                    break;
                }
                // merge一段， 切一段给下一圈
                currSt.amount -= st.amount;
                st.tokenStart = currSt.tokenEnd;
                current = currSt.next;
                continue;
            }

            // 在区间里 切成两段或者三段, 或者右超出， 切新片给下个元素
            if(currSt.tokenStart < st.tokenStart ) { 
                console.log('aaaa');
                // 处理前段
                uint index = _addSlice(addr, currSt.tokenStart, st.tokenStart, currSt.amount, current);
                if(current == headerIndex[addr]) { // 检查是否是第一次就遇到了前面完全空。只有第一次需要把链表头换成它
                    headerIndex[addr] = index; 
                }else {
                    // 更新它的上一个片的指针为它
                    uint _current = headerIndex[addr];
                    while(_current > 0) {
                        // console.log('_current:', _current, balances[addr][_current].next);
                        if(balances[addr][_current].next == current)  {
                            // console.log('_current111:', _current);
                            balances[addr][_current].next = index;
                            break;
                        }
                        _current = balances[addr][_current].next;
                    }
                }

                // 处理中段
                uint256 currStAmunt = currSt.amount;
                uint256 currStTokenEnd = currSt.tokenEnd;
                currSt.amount -= st.amount;
                currSt.tokenStart = st.tokenStart;
                // currSt.tokenEnd = st.tokenEnd;

                if(currStTokenEnd >= st.tokenEnd) {  // 内包含 合并完退出，不会进入下一圈循环。 (2||3 段)
                    if(currStTokenEnd > st.tokenEnd) {
                         uint index = _addSlice(addr, st.tokenEnd, currStTokenEnd, currStAmunt, currSt.next);
                         currSt.next = index;
                    }
                    // console.log('333333');
                    break; //结束了，不用再匹配
                }
                 // 如果超过了，截取后循环
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
