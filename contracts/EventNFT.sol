//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventNFT is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter public tokenIds;
    mapping (uint=>string) internal idToUri;
    address private eventsContract;
    mapping (uint=>uint) public idToPrice;
    mapping (uint=>address) public idToOrganizer;
    struct Event {
        uint id;
        uint price;
        address organizer;
        uint ticketsAvailable;
        string uri;
    }

    event EventCreated(uint id, uint price, address organizer, uint ticketsAvailable, string uri);

    constructor(address _eventsContract) public ERC1155("") {
        eventsContract = _eventsContract;
    }
    /// @dev Function to mint a new erc1155 token
    /// @param price, the price of the event ticket
    /// @param amount, the amount of tickets to mint
    function createEvent(uint price, uint amount, string memory newUri) external returns(uint){
        uint _id = tokenIds.current();
        _mint(msg.sender, _id, amount, "");
        idToPrice[_id] = price;
        _setURI(_id, newUri);
        setApprovalForAll(eventsContract, true);
        idToOrganizer[_id] = msg.sender;
        tokenIds.increment();
        emit EventCreated(_id, price, msg.sender, amount, newUri);
        return _id;
    }
    /// @dev function to set the uri of an event
     function _setURI(uint tokenId, string memory newUri) internal {
        idToUri[tokenId] =  newUri;
    }

    // Get URI of a batch
    function getURI(uint tokenId) public view returns(string memory){
        return idToUri[tokenId];
    }
    /// @dev function to get all the minted events
    /// Returns a list of all the events
    function getEvents() external view returns(Event[] memory){
        uint totalEvents = tokenIds.current();
        Event[] memory result = new Event[](totalEvents);
        for (uint i = 0; i < totalEvents; i++) {
            address organizer= idToOrganizer[i];
            result[i] = Event(i, idToPrice[i], organizer, balanceOf(organizer, i), idToUri[i]);
        }
        return result;
    }

    /// @dev this function iterates through all events and returns the ones that are owned by the caller
    function getMyEvents() external view returns(Event[] memory){
        uint totalEvents = tokenIds.current();
        uint myTotalEvents = 0;
        for(uint i=0; i<totalEvents; i++){
            if (balanceOf(msg.sender, i)>0){
                myTotalEvents++;
            }
        }
        Event[] memory result = new Event[](myTotalEvents);
        uint counter;
        for (uint i = 0; i < totalEvents; i++) {
            if (balanceOf(msg.sender, i)>0){
                address organizer= idToOrganizer[i];
                result[counter] = Event(i, idToPrice[i], organizer, balanceOf(organizer, i), idToUri[i]);
                counter++;
            }
        }
        return result;
    }
}