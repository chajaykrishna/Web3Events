//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Events is ERC1155 {
    using Counters for Counters.Counter;
    uint constant public MAX_UINT256 = 2**256 - 1;
    Counters.Counter public tokenIds;
    mapping (uint=>uint) public idToPrice;
    mapping (uint=>string) internal idToUri;
    // mapping from tokenId to event Organizer
    mapping (uint=>address) internal idToOrganizer;
    string internal _uri;


    constructor() public ERC1155("") {
    }

    function createEvent(uint price, uint amount, string calldata newUri) external returns(uint){
        tokenIds.increment();
        uint _id = tokenIds.current();
        _mint(msg.sender, _id, amount, "");
        idToPrice[_id] = price;
        _setURI(_id, newUri);
        setApprovalForAll(address(this), true);
        idToOrganizer[_id] = msg.sender;
        return _id;
    }

    function _setURI(uint tokenId, string memory newUri) internal {
        idToUri[tokenId] =  newUri;
    }

    // Get URI of a batch
    function getURI(uint tokenId) public view returns(string memory){
        return idToUri[tokenId];
    }

    function buyEventPass(uint tokenId) external payable {
        require(msg.value == idToPrice[tokenId]);
        require(tokenId >0, "Invalid tokenId");
        // send one event tiket for the buyer 
        safeTransferFrom(idToOrganizer[tokenId], msg.sender, tokenId, 1, "");
        // send the payment to the organizer
        (bool success, ) = address(this).call{value: msg.value}("");
        require(success, "payment to organizer failed");
    }

    function getEvents() external view returns(string[] memory){
        string[] memory result = new string[](tokenIds.current());
        for (uint i = 1; i <= tokenIds.current(); i++) {
            result[i] = getURI(i);
        }
        return result;
    }
    
}
