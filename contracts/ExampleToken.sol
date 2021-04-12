//SPDX-License-Identifier: Unlicense
pragma solidity =0.7.6;

import './FRC758.sol';
import './Controllable.sol';
contract ExampleToken is FRC758, Controllable {

   constructor(string memory name, string memory symbol, uint256 decimals ) FRC758(name, symbol, decimals){}

    function mint(address _receiver, uint256 amount, uint256 tokenStart, uint256 tokenEnd) external  onlyController {
        if (tokenEnd == MAX_UINT) {
            _totalSupply += amount;
        }
        _mint(_receiver, amount, tokenStart, tokenEnd);
    }

    function burn(address _owner, uint256 amount, uint256 tokenStart, uint256 tokenEnd) public onlyController {
        _burn(_owner, amount, tokenStart, tokenEnd);
    }

    function onTimeSlicedTokenReceived(address _operator, address _from, uint256 amount, uint256 newTokenStart, uint256 newTokenEnd) public pure returns(bytes4) {
        _operator = address(0);
        _from = address(0);
        amount = 0;
        newTokenStart = 0;
        newTokenEnd = 0;
        return bytes4(keccak256("onTimeSlicedTokenReceived(address,address,uint256,uint256,uint256)"));
    }
}