//SPDX-License-Identifier: ChaingeFinance
pragma solidity = 0.7.6;

import './FRC758.sol';
import './Controllable.sol';
import "@nomiclabs/buidler/console.sol";

contract ExampleToken is FRC758, Controllable {

    uint256 public circulationSupply = 0;

    constructor(string memory name, string memory symbol, uint256 decimals, uint256 limit) FRC758(name, symbol, decimals){
        totalSupply = limit  * 10 ** decimals;
    }

	function mint(address _recipient, uint256 amount) external onlyController {
		require((amount + circulationSupply) <= totalSupply, "FRC758: can not mint more tokens");
        circulationSupply += amount;
        _mint(_recipient, amount);
    }

	function burn(address _owner, uint256 amount) public onlyController {
        _burn(_owner, amount);
    }

    function burnTimeSlice(address _from, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public onlyController  {
        _burnSlice(_from, amount, tokenStart, tokenEnd);
    }

    function mintTimeSlice(address _from, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public onlyController {
        _mintSlice(_from, amount, tokenStart, tokenEnd);
    }

    function balanceOf(address account) public view returns (uint256) {
        return timeBalanceOf(account, block.timestamp, MAX_TIME) + balance[account];
    }

    function transfer(address _recipient, uint256 amount) public returns (bool) {
        transferFrom(msg.sender, _recipient, amount);
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
    
    function onTimeSlicedTokenReceived(address _operator, address _from, uint256 amount, uint256 newTokenStart, uint256 newTokenEnd) public pure returns(bytes4) {
        _operator = address(0);
        _from = address(0);
        amount = 0;
        newTokenStart = 0;
        newTokenEnd = 0;
        return bytes4(keccak256("onTimeSlicedTokenReceived(address,address,uint256,uint256,uint256)"));
    }
    
    function clean(address from, uint256 tokenStart, uint256 tokenEnd) public {
        require(msg.sender == from);
        _clean(from, tokenStart, tokenEnd);
    }
}
