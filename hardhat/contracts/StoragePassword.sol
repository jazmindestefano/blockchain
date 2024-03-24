// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title StoragePassword
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract StoragePassword {

    struct PasswordEntry {
        bytes32 encryptedPassword;
    }

    mapping(address => PasswordEntry) private passwords;

    event PasswordStored(address indexed user);

    function storePassword(bytes32 _encryptedPassword) public {
        passwords[msg.sender].encryptedPassword = _encryptedPassword;
        emit PasswordStored(msg.sender);
    }

    function getPassword() public view returns (bytes32) {
        return passwords[msg.sender].encryptedPassword;
    }
}