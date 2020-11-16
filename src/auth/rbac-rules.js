const rules = {
  visitor: {
    static: ["home:visit"]
  },
  gym: {
    static: [
      "gym:getSelf",
      "gym:editSelf",
      "home:visit",
      "dashboard:visit"
    ]
  },
  sys_admin: {
    static: [
      "gym:list",
      "gym:create",
      "gym:edit",
      "gym:delete",
      "home:visit",
      "dashboard:visit"
    ]
  }
};

export default rules;