// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";

contract DappVotes {
    using Counters for Counters.Counter;
    
    Counters.Counter private pollCounter;
    Counters.Counter private contestantCounter;
    
    // Custom errors for gas efficiency
    error InvalidPoll();
    error InvalidTime();
    error NotDirector();
    error PollDeleted();
    error VotingClosed();
    error VotingNotStarted();
    error AlreadyVoted();
    
    struct Poll {
        uint256 id;
        string image;
        string title;
        string description;
        uint256 totalVotes;
        uint256 totalContestants;
        bool deleted;
        address director;
        uint256 startTime;
        uint256 endTime;
        uint256 createdAt;
    }
    
    struct Contestant {
        uint256 id;
        string image;
        string name;
        address voter;
        uint256 votes;
        address[] voters;
    }
    
    // Storage mappings
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(uint256 => Contestant)) public contestants;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => bool) public pollExists;
    mapping(uint256 => uint256[]) private pollContestants;
    uint256[] private allPollIds;
    
    // Events
    event PollCreated(uint256 indexed pollId, address indexed director);
    event PollUpdated(uint256 indexed pollId, address indexed director);
    event PollDeleted(uint256 indexed pollId, address indexed director);
    event ContestAdded(
        uint256 indexed pollId,
        uint256 indexed contestantId,
        string image,
        string name,
        address indexed voter
    );
    event Voted(
        uint256 indexed pollId,
        uint256 indexed contestantId,
        address indexed voter
    );
    
    // Modifiers
    modifier validPoll(uint256 pollId) {
        if (!pollExists[pollId]) revert InvalidPoll();
        _;
    }
    
    modifier notDeleted(uint256 pollId) {
        if (polls[pollId].deleted) revert PollDeleted();
        _;
    }
    
    modifier onlyDirector(uint256 pollId) {
        if (polls[pollId].director != msg.sender) revert NotDirector();
        _;
    }
    
    modifier withinVotingPeriod(uint256 pollId) {
        uint256 currentTime = block.timestamp;
        if (currentTime < polls[pollId].startTime) revert VotingNotStarted();
        if (currentTime > polls[pollId].endTime) revert VotingClosed();
        _;
    }
    
    modifier hasNotVoted(uint256 pollId) {
        if (hasVoted[pollId][msg.sender]) revert AlreadyVoted();
        _;
    }
    
    // Poll management functions
    function createPoll(
        string memory image,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime
    ) external {
        if (startTime >= endTime || startTime < block.timestamp) revert InvalidTime();
        
        pollCounter.increment();
        uint256 newPollId = pollCounter.current();
        
        polls[newPollId] = Poll({
            id: newPollId,
            image: image,
            title: title,
            description: description,
            totalVotes: 0,
            totalContestants: 0,
            deleted: false,
            director: msg.sender,
            startTime: startTime,
            endTime: endTime,
            createdAt: block.timestamp
        });
        
        pollExists[newPollId] = true;
        allPollIds.push(newPollId);
        
        emit PollCreated(newPollId, msg.sender);
    }
    
    function updatePoll(
        uint256 id,
        string memory image,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime
    ) external validPoll(id) notDeleted(id) onlyDirector(id) {
        if (startTime >= endTime) revert InvalidTime();
        
        Poll storage poll = polls[id];
        poll.image = image;
        poll.title = title;
        poll.description = description;
        poll.startTime = startTime;
        poll.endTime = endTime;
        
        emit PollUpdated(id, msg.sender);
    }
    
    function deletePoll(uint256 id) external validPoll(id) onlyDirector(id) {
        polls[id].deleted = true;
        emit PollDeleted(id, msg.sender);
    }
    
    // Contest function
    function contest(
        uint256 pollId,
        string memory image,
        string memory name
    ) external validPoll(pollId) notDeleted(pollId) {
        if (block.timestamp >= polls[pollId].endTime) revert VotingClosed();
        
        contestantCounter.increment();
        uint256 newContestantId = contestantCounter.current();
        
        contestants[pollId][newContestantId] = Contestant({
            id: newContestantId,
            image: image,
            name: name,
            voter: msg.sender,
            votes: 0,
            voters: new address[](0)
        });
        
        pollContestants[pollId].push(newContestantId);
        polls[pollId].totalContestants++;
        
        emit ContestAdded(pollId, newContestantId, image, name, msg.sender);
    }
    
    // Voting function
    function vote(
        uint256 pollId,
        uint256 contestantId
    ) external 
        validPoll(pollId) 
        notDeleted(pollId) 
        withinVotingPeriod(pollId) 
        hasNotVoted(pollId) 
    {
        // Verify contestant exists
        if (contestants[pollId][contestantId].id == 0) revert InvalidPoll();
        
        // Record vote
        hasVoted[pollId][msg.sender] = true;
        contestants[pollId][contestantId].votes++;
        contestants[pollId][contestantId].voters.push(msg.sender);
        polls[pollId].totalVotes++;
        
        emit Voted(pollId, contestantId, msg.sender);
    }
    
    // View functions
    function getPoll(uint256 id) external view validPoll(id) returns (Poll memory) {
        return polls[id];
    }
    
    function getPolls() external view returns (Poll[] memory) {
        uint256 activeCount = 0;
        
        // Count non-deleted polls
        for (uint256 i = 0; i < allPollIds.length; i++) {
            if (!polls[allPollIds[i]].deleted) {
                activeCount++;
            }
        }
        
        // Create array of active polls
        Poll[] memory activePolls = new Poll[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allPollIds.length; i++) {
            if (!polls[allPollIds[i]].deleted) {
                activePolls[currentIndex] = polls[allPollIds[i]];
                currentIndex++;
            }
        }
        
        return activePolls;
    }
    
    function getContestant(
        uint256 pollId,
        uint256 contestantId
    ) external view validPoll(pollId) returns (Contestant memory) {
        return contestants[pollId][contestantId];
    }
    
    function getContestants(uint256 pollId) external view validPoll(pollId) returns (Contestant[] memory) {
        uint256[] memory contestantIds = pollContestants[pollId];
        Contestant[] memory pollContestantsList = new Contestant[](contestantIds.length);
        
        for (uint256 i = 0; i < contestantIds.length; i++) {
            pollContestantsList[i] = contestants[pollId][contestantIds[i]];
        }
        
        return pollContestantsList;
    }
    
    // Utility functions
    function hasAddressVoted(uint256 pollId, address voter) external view returns (bool) {
        return hasVoted[pollId][voter];
    }
    
    function nowTime() external view returns (uint256) {
        return block.timestamp;
    }
}