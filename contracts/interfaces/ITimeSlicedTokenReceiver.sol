//SPDX-License-Identifier: Unlicense
pragma solidity =0.7.6;


//Contracts implemented onTimeSlicedTokenReceived and returned proper bytes is treated as Time Sliced Token safe.
abstract contract ITimeSlicedTokenReceiver {
    function onTimeSlicedTokenReceived(address _operator, address _from, uint256 amount, uint256 newTokenStart, uint256 newTokenEnd ) virtual public returns(bytes4);
}
