module.exports = jest.fn(() => {
    return {
      messages: {
        create: jest.fn().mockResolvedValue({
          sid: "MOCK_TWILIO_SID",
        }),
      },
    };
  });
  