
//SPDX-License-Identifier: Unlicense
pragma solidity =0.7.6;
import './Ownable.sol';
contract Controllable is Ownable {
    mapping(address => bool) controllers;

    modifier onlyController {
        require(_isController(msg.sender), "no controller rights");
        _;
    }

    function _isController(address _controller) internal view returns (bool) {
        //owner defaults to controller
        return msg.sender == owner || controllers[_controller];
    }

    function addControllers(address[] calldata _controllers) external onlyOwner {
        for (uint256 i = 0; i < _controllers.length; i++) {
            _validateAddress2(_controllers[i]);
            controllers[_controllers[i]] = true;
        }
    }
    
    function removeControllers(address[] calldata _controllers) external onlyOwner {
        for (uint256 i = 0; i < _controllers.length; i++) {
            _validateAddress2(_controllers[i]);
            controllers[_controllers[i]] = false;
        }
    }
}