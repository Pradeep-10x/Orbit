export const emitToUser = (req, userId, event, payload) => {
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, payload);
  }
};

// Emit to all members of a community
export const emitToCommunity = async (req, communityId, event, payload) => {
  try {
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const { Community } = await import("../models/community.model.js");

    // Get community members
    const community = await Community.findById(communityId).select("members admins creator");
    if (!community) {
      console.warn(`Community ${communityId} not found for emitToCommunity`);
      return;
    }

    // Combine members, admins, and creator
    const allMembers = new Set();
    if (community.members && Array.isArray(community.members)) {
      community.members.forEach(m => allMembers.add(m.toString()));
    }
    if (community.admins && Array.isArray(community.admins)) {
      community.admins.forEach(a => allMembers.add(a.toString()));
    }
    if (community.creator) {
      allMembers.add(community.creator.toString());
    }

    // Emit to all online members
    let emittedCount = 0;
    allMembers.forEach(userId => {
      const socketId = onlineUsers.get(userId);
      if (socketId) {
        io.to(socketId).emit(event, payload);
        emittedCount++;
      }
    });
    
    console.log(`Emitted ${event} to ${emittedCount} online members of community ${communityId}`);
  } catch (error) {
    console.error('Error in emitToCommunity:', error);
  }
};
