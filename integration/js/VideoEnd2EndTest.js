const {OpenAppStep, WaitForMeetingToBeCreated, JoinVideoTestMeetingStep, ClickStartLocalVideoButton, AuthenticateUserStep, ClickStopLocalVideoButton, ClickHasStartedLocalVideoTileButton, ClickAddVideoTileButton, ClickGetLocalVideoTileButton, ClickHaveVideoTileForAttendeeIdButton, ClickSendTileStateUpdateButton, ClickGetAllVideoTilesButton, ClickGetAllRemoteVideoTilesButton, ClickHaveVideoTilesWithStreamsButton, ClickRemoveAllVideoTilesButton, WaitForAllParticipantsToJoinMeeting, WaitForAllParticipantsToTurnVideoOn, WaitForAllParticipantsToTurnVideoOff} = require('./steps');
const {TestUtils} = require('kite-common');
const SdkBaseTest = require('./utils/SdkBaseTest');
const {TileStateCheck, AddVideoTileCheck, GetAllVideoTilesCheck, HasStartedLocalVideoTileCheck, HaveVideoTilesWithStreamsCheck, GetAllRemoteVideoTilesCheck, GetLocalVideoTileCheck, HaveVideoTileForAttendeeIdCheck} = require('./checks');
const { v4: uuidv4 } = require('uuid');

class VideoTestEnd2End extends SdkBaseTest {
  constructor(name, kiteConfig) {
    super(name, kiteConfig, "TestAppVideoEnd2End");
  }

  async runIntegrationTest() {
    this.numberOfParticipant = 2;
    const session = this.seleniumSessions[0];
    const useSimulcast = this.useSimulcast;
    await WaitForMeetingToBeCreated.executeStep(this, session);
    await OpenAppStep.executeStep(this, session);
    await JoinVideoTestMeetingStep.executeStep(this, session, this.attendeeId, this.meetingTitle, useSimulcast);
    // 2 attendees join from 2 different browser sessions
    await WaitForAllParticipantsToJoinMeeting.executeStep(this, session, '2');

    // Both attendees turn on their local video
    await ClickStartLocalVideoButton.executeStep(this, session);
    await WaitForAllParticipantsToTurnVideoOn.executeStep(this, session, '1');

    // Verify that both attendees can see their local video on
    await ClickHasStartedLocalVideoTileButton.executeStep(this, session);
    await HasStartedLocalVideoTileCheck.executeStep(this, session, 'true');
    await ClickGetLocalVideoTileButton.executeStep(this, session);
    await GetLocalVideoTileCheck.executeStep(this, session, '1')
   
    await ClickHaveVideoTileForAttendeeIdButton.executeStep(this, session);
    await HaveVideoTileForAttendeeIdCheck.executeStep(this, session, 'true');
    await ClickHaveVideoTilesWithStreamsButton.executeStep(this, session);
    await HaveVideoTilesWithStreamsCheck.executeStep(this, session, 'true');

    // Verify that both attendees can see the other attendee’s remote video
    await ClickGetAllRemoteVideoTilesButton.executeStep(this,session);
    await GetAllRemoteVideoTilesCheck.executeStep(this, session, '1');

    await ClickGetAllVideoTilesButton.executeStep(this,session);
    await GetAllVideoTilesCheck.executeStep(this, session, '2');

    // Both attendees turn off their video
    await ClickStopLocalVideoButton.executeStep(this, session);
    await WaitForAllParticipantsToTurnVideoOff.executeStep(this, session, '1');
    await ClickSendTileStateUpdateButton.executeStep(this, session);

    // Verify that both attendees’ local videos off
    await ClickHasStartedLocalVideoTileButton.executeStep(this, session);
    await HasStartedLocalVideoTileCheck.executeStep(this, session, 'false');

    await TestUtils.waitAround(1000);

    // Verify that both attendees’ remote videos off
    await ClickGetAllRemoteVideoTilesButton.executeStep(this,session);
    await GetAllRemoteVideoTilesCheck.executeStep(this, session, '0');

    await ClickRemoveAllVideoTilesButton.executeStep(this, session);
    await ClickGetAllVideoTilesButton.executeStep(this,session);
    await GetAllVideoTilesCheck.executeStep(this, session, '0');

    await ClickAddVideoTileButton.executeStep(this, session);
    await AddVideoTileCheck.executeStep(this, session, '3');
    await this.waitAllSteps();
  }
}

module.exports = VideoTestEnd2End;

(async () => {
  const kiteConfig = await TestUtils.getKiteConfig(__dirname);
  let test = new VideoTestEnd2End('Test App End2End Video Test', kiteConfig);
  await test.run();
})();
