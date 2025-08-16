const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("DappVotes", function () {
  let dappVotes;
  let owner, director, voter1, voter2, contestant1, contestant2;
  let startTime, endTime;

  beforeEach(async function () {
    [owner, director, voter1, voter2, contestant1, contestant2] = await ethers.getSigners();
    
    const DappVotes = await ethers.getContractFactory("DappVotes");
    dappVotes = await DappVotes.deploy();
    
    // Set up time windows
    const currentTime = await time.latest();
    startTime = currentTime + 60; // Start in 1 minute
    endTime = currentTime + 3600; // End in 1 hour
  });

  describe("Poll Management", function () {
    it("Should create a poll successfully", async function () {
      await expect(
        dappVotes.connect(director).createPoll(
          "https://example.com/image.jpg",
          "Test Poll",
          "A test poll description",
          startTime,
          endTime
        )
      ).to.emit(dappVotes, "PollCreated").withArgs(1, director.address);

      const poll = await dappVotes.getPoll(1);
      expect(poll.title).to.equal("Test Poll");
      expect(poll.director).to.equal(director.address);
      expect(poll.deleted).to.be.false;
    });

    it("Should fail to create poll with invalid time", async function () {
      await expect(
        dappVotes.connect(director).createPoll(
          "https://example.com/image.jpg",
          "Test Poll",
          "Description",
          endTime, // Invalid: start after end
          startTime
        )
      ).to.be.revertedWithCustomError(dappVotes, "InvalidTime");
    });

    it("Should update poll by director only", async function () {
      // Create poll
      await dappVotes.connect(director).createPoll(
        "https://example.com/image.jpg",
        "Test Poll",
        "Description",
        startTime,
        endTime
      );

      // Update by director should work
      await expect(
        dappVotes.connect(director).updatePoll(
          1,
          "https://example.com/new-image.jpg",
          "Updated Poll",
          "Updated description",
          startTime,
          endTime
        )
      ).to.emit(dappVotes, "PollUpdated").withArgs(1, director.address);

      // Update by non-director should fail
      await expect(
        dappVotes.connect(voter1).updatePoll(
          1,
          "https://example.com/image.jpg",
          "Hacked Poll",
          "Hacked description",
          startTime,
          endTime
        )
      ).to.be.revertedWithCustomError(dappVotes, "NotDirector");
    });

    it("Should delete poll by director only", async function () {
      // Create poll
      await dappVotes.connect(director).createPoll(
        "https://example.com/image.jpg",
        "Test Poll",
        "Description",
        startTime,
        endTime
      );

      // Delete by director should work
      await expect(
        dappVotes.connect(director).deletePoll(1)
      ).to.emit(dappVotes, "PollDeleted").withArgs(1, director.address);

      const poll = await dappVotes.getPoll(1);
      expect(poll.deleted).to.be.true;

      // Delete by non-director should fail
      await dappVotes.connect(director).createPoll(
        "https://example.com/image.jpg",
        "Test Poll 2",
        "Description",
        startTime,
        endTime
      );

      await expect(
        dappVotes.connect(voter1).deletePoll(2)
      ).to.be.revertedWithCustomError(dappVotes, "NotDirector");
    });
  });

  describe("Contest Registration", function () {
    beforeEach(async function () {
      await dappVotes.connect(director).createPoll(
        "https://example.com/image.jpg",
        "Test Poll",
        "Description",
        startTime,
        endTime
      );
    });

    it("Should allow contest registration", async function () {
      await expect(
        dappVotes.connect(contestant1).contest(
          1,
          "https://example.com/contestant1.jpg",
          "Contestant 1"
        )
      ).to.emit(dappVotes, "ContestAdded").withArgs(1, 1, "https://example.com/contestant1.jpg", "Contestant 1", contestant1.address);

      const contestants = await dappVotes.getContestants(1);
      expect(contestants.length).to.equal(1);
      expect(contestants[0].name).to.equal("Contestant 1");
      expect(contestants[0].voter).to.equal(contestant1.address);
    });

    it("Should fail contest registration for deleted poll", async function () {
      await dappVotes.connect(director).deletePoll(1);

      await expect(
        dappVotes.connect(contestant1).contest(
          1,
          "https://example.com/contestant1.jpg",
          "Contestant 1"
        )
      ).to.be.revertedWithCustomError(dappVotes, "PollDeleted");
    });

    it("Should fail contest registration after end time", async function () {
      // Fast forward past end time
      await time.increaseTo(endTime + 1);

      await expect(
        dappVotes.connect(contestant1).contest(
          1,
          "https://example.com/contestant1.jpg",
          "Contestant 1"
        )
      ).to.be.revertedWithCustomError(dappVotes, "VotingClosed");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await dappVotes.connect(director).createPoll(
        "https://example.com/image.jpg",
        "Test Poll",
        "Description",
        startTime,
        endTime
      );

      // Add contestants
      await dappVotes.connect(contestant1).contest(
        1,
        "https://example.com/contestant1.jpg",
        "Contestant 1"
      );
      await dappVotes.connect(contestant2).contest(
        1,
        "https://example.com/contestant2.jpg",
        "Contestant 2"
      );

      // Fast forward to voting period
      await time.increaseTo(startTime + 1);
    });

    it("Should allow voting within time window", async function () {
      await expect(
        dappVotes.connect(voter1).vote(1, 1)
      ).to.emit(dappVotes, "Voted").withArgs(1, 1, voter1.address);

      const contestant = await dappVotes.getContestant(1, 1);
      expect(contestant.votes).to.equal(1);

      const poll = await dappVotes.getPoll(1);
      expect(poll.totalVotes).to.equal(1);

      const hasVoted = await dappVotes.hasAddressVoted(1, voter1.address);
      expect(hasVoted).to.be.true;
    });

    it("Should prevent double voting", async function () {
      await dappVotes.connect(voter1).vote(1, 1);

      await expect(
        dappVotes.connect(voter1).vote(1, 2)
      ).to.be.revertedWithCustomError(dappVotes, "AlreadyVoted");
    });

    it("Should fail voting before start time", async function () {
      // Go back before start time
      await time.increaseTo(startTime - 60);

      await expect(
        dappVotes.connect(voter1).vote(1, 1)
      ).to.be.revertedWithCustomError(dappVotes, "VotingNotStarted");
    });

    it("Should fail voting after end time", async function () {
      // Fast forward past end time
      await time.increaseTo(endTime + 1);

      await expect(
        dappVotes.connect(voter1).vote(1, 1)
      ).to.be.revertedWithCustomError(dappVotes, "VotingClosed");
    });

    it("Should fail voting on deleted poll", async function () {
      await dappVotes.connect(director).deletePoll(1);

      await expect(
        dappVotes.connect(voter1).vote(1, 1)
      ).to.be.revertedWithCustomError(dappVotes, "PollDeleted");
    });

    it("Should fail voting for non-existent contestant", async function () {
      await expect(
        dappVotes.connect(voter1).vote(1, 999)
      ).to.be.revertedWithCustomError(dappVotes, "InvalidPoll");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Create multiple polls
      await dappVotes.connect(director).createPoll(
        "https://example.com/image1.jpg",
        "Poll 1",
        "Description 1",
        startTime,
        endTime
      );
      await dappVotes.connect(director).createPoll(
        "https://example.com/image2.jpg",
        "Poll 2",
        "Description 2",
        startTime,
        endTime
      );
      await dappVotes.connect(director).createPoll(
        "https://example.com/image3.jpg",
        "Poll 3",
        "Description 3",
        startTime,
        endTime
      );

      // Delete one poll
      await dappVotes.connect(director).deletePoll(2);
    });

    it("Should return all non-deleted polls", async function () {
      const polls = await dappVotes.getPolls();
      expect(polls.length).to.equal(2);
      expect(polls[0].title).to.equal("Poll 1");
      expect(polls[1].title).to.equal("Poll 3");
    });

    it("Should return correct current time", async function () {
      const contractTime = await dappVotes.nowTime();
      const currentTime = await time.latest();
      expect(contractTime).to.be.closeTo(currentTime, 2);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle invalid poll ID", async function () {
      await expect(
        dappVotes.getPoll(999)
      ).to.be.revertedWithCustomError(dappVotes, "InvalidPoll");
    });

    it("Should handle empty contestant list", async function () {
      await dappVotes.connect(director).createPoll(
        "https://example.com/image.jpg",
        "Empty Poll",
        "Description",
        startTime,
        endTime
      );

      const contestants = await dappVotes.getContestants(1);
      expect(contestants.length).to.equal(0);
    });
  });
});