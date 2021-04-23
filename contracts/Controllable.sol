//SPDX-License-Identifier: ChaingeFinance
pragma solidity = 0.7.6;
import './Ownable.sol';
abstract contract Controllable is Ownable {
    mapping(address => bool) controllers;
    address[] public addressCount;

    modifier onlyController {
        require(_isController(msg.sender), "no controller rights");
        _;
    }

    function _isController(address _controller) internal view returns (bool) {
        return msg.sender == owner || controllers[_controller];
    }

    function addController(address _controller) external onlyOwner {
        _validateAddress2(_controller);
        controllers[_controller] = true;
        addressCount.push(_controller);
    }
    
    function removeController(address _controller) external onlyOwner {
         _validateAddress2(_controller);
         controllers[_controller] = false;
         address[] memory addresses = addressCount;
         address[] memory newAddresses;
         uint256 ii = 0;
         for(uint256 i = 0; i< addresses.length; i++) {
             if(addresses[i] == _controller) {
                 continue;
             }
             newAddresses[ii] = addresses[i];
             ii++;
         }
         addressCount = newAddresses;
    }
}
