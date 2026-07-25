// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MemeCoin is ERC20, ERC20Burnable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor() ERC20("Verity", "VRT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
