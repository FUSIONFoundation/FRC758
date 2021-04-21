//SPDX-License-Identifier: Unlicense
pragma solidity =0.7.6;

import './FRC758.sol';
import './Controllable.sol';
import "@nomiclabs/buidler/console.sol";

contract ExampleToken is FRC758, Controllable {

    uint256 private constant TotalLimit = 814670050000000000000000000;
    
    constructor(string memory name, string memory symbol, uint256 decimals, totalLimit ) FRC758(name, symbol, decimals){}

	function mint(address _receiver, uint256 amount) external onlyController {
		require((amount + _totalSupply) <= TotalLimit, "can not mint more tokens");
        _mint(_receiver, amount, block.timestamp, MAX_TIME);
		_totalSupply += amount;
    }

	function burn(address _owner, uint256 amount) public onlyController {
        _burn(_owner, amount, block.timestamp, MAX_TIME);
    }

    function onTimeSlicedTokenReceived(address _operator, address _from, uint256 amount, uint256 newTokenStart, uint256 newTokenEnd) public pure returns(bytes4) {
        _operator = address(0);
        _from = address(0);
        amount = 0;
        newTokenStart = 0;
        newTokenEnd = 0;
        return bytes4(keccak256("onTimeSlicedTokenReceived(address,address,uint256,uint256,uint256)"));
    }

    function balanceOf(address account) public view returns (uint256) {
        return timeBalanceOf(account, block.timestamp, MAX_TIME);
    }

    function transfer(address _receiver, uint256 amount) public returns (bool) {
        safeTransferFrom(msg.sender, _receiver, amount, block.timestamp, MAX_TIME);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        if(operatorApprovals[owner][spender]) {
            return 1;
        }
        return 0;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        bool _approved = false;
        if(amount >0) {
            _approved = true;
        }
        setApprovalForAll(spender, _approved);
        return true;
    }

    function transferFrom(address sender, address _receiver, uint256 amount) public returns (bool) {
        safeTransferFrom(sender, _receiver, amount, block.timestamp, MAX_TIME);
        return true;
    }

    function mintTimeSlice(address _receiver, uint256 amount, uint256 tokenStart, uint256 tokenEnd) external onlyController {
		require((amount + _totalSupply) <= TotalLimit, "can not mint more tokens");
        _mint(_receiver, amount, tokenStart, tokenEnd);
		_totalSupply += amount;
    }

    function burnTimeSlice(address _owner, uint256 amount, uint256 tokenStart, uint256 tokenEnd) external onlyController {
        _burn(_owner, amount, tokenStart, tokenEnd);
    }

}