//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EventNFT.sol";
import "hardhat/console.sol";

contract EventSeller is Ownable{
    address private eventContract;
    

    function setEventContract(address _eventContract) public onlyOwner {
        eventContract = _eventContract;
    }

    function buyEventPass(uint tokenId) external payable {
        EventNFT eventNFT= EventNFT(eventContract);
        address payable organizer = payable(eventNFT.idToOrganizer(tokenId));
        require(tokenId < eventNFT.tokenIds(), "tokenId invalid");
        require(msg.value == eventNFT.idToPrice(tokenId), "invalid amount");
        // send one event tiket for the buyer 
        eventNFT.safeTransferFrom(organizer, msg.sender, tokenId, 1, "");
        // send the payment to the organizer
        (bool success, ) = organizer.call{value: msg.value}("");
        require(success, "payment to organizer failed");
    }

    
    
}
