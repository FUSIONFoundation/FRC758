//SPDX-License-Identifier: Unlicense
pragma solidity =0.7.6;
//Make the contract Ownable by someone.
abstract contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function _validateAddress2(address _addr) internal pure {
        require(_addr != address(0), "invalid address");
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not a contract owner");
        _;
    }

    //transfer the ownership to the new address.
    function transferOwnership(address newOwner) external onlyOwner {
        _validateAddress2(newOwner);
        owner = newOwner;
        emit OwnershipTransferred(owner, newOwner);
    }
}