
//SPDX-License-Identifier: Unlicense
pragma solidity =0.7.6;
import './Ownable.sol';
contract Controllable is Ownable {
    mapping(address => bool) controllers;
    address[] public addressCount;

    modifier onlyController {
        require(_isController(msg.sender), "no controller rights");
        _;
    }

    function _isController(address _controller) internal view returns (bool) {
        return msg.sender == owner || controllers[_controller];
    }

    function addControllers(address _controller) external onlyOwner {
        _validateAddress2(_controller);
        controllers[_controller] = true;
        addressCount.push(_controller);
    }
    
    function removeControllers(address _controller) external onlyOwner {
         _validateAddress2(_controller);
         controllers[_controller] = false;
         address[] addresses = addressCount;
         address[] newAddresses;
         uint ii = 0;
         for(i = 0; i< addresses.length; i++) {
             if(addresses[i] == _controller) {
                 continue;
             }
             newAddresses[ii] = addresses[i];
             ii++;
         }
         addressCount = newAddresses;
    }
}