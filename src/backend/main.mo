import Array "mo:core/Array";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type TradeOutcome = { #win; #loss };

  type Trade = {
    timestamp : Time.Time;
    invest : Float;
    outcome : TradeOutcome;
    profitOrLoss : Float;
  };

  type UserTradingData = {
    var capital : Float;
    var target : Float;
    var totalProfit : Float;
    var totalLoss : Float;
    trades : List.List<Trade>;
  };

  public type UserProfile = {
    name : Text;
  };

  let tradingDataMap = Map.empty<Principal, UserTradingData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getOrCreateTradingData(caller : Principal) : UserTradingData {
    switch (tradingDataMap.get(caller)) {
      case (null) {
        let newData = {
          var capital = 0.0;
          var target = 0.0;
          var totalProfit = 0.0;
          var totalLoss = 0.0;
          trades = List.empty<Trade>();
        };
        tradingDataMap.add(caller, newData);
        newData;
      };
      case (?data) { data };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getTradingData() : async {
    capital : Float;
    target : Float;
    totalProfit : Float;
    totalLoss : Float;
    trades : [Trade];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trading data");
    };
    let data = getOrCreateTradingData(caller);
    {
      capital = data.capital;
      target = data.target;
      totalProfit = data.totalProfit;
      totalLoss = data.totalLoss;
      trades = data.trades.toArray();
    };
  };

  public shared ({ caller }) func setCapital(capital : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set capital");
    };
    let data = getOrCreateTradingData(caller);
    data.capital := capital;
  };

  public shared ({ caller }) func setTargetProfit(target : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set target profit");
    };
    let data = getOrCreateTradingData(caller);
    data.target := target;
  };

  public shared ({ caller }) func recordTrade(invest : Float, outcome : TradeOutcome) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record trades");
    };
    let data = getOrCreateTradingData(caller);
    let profitOrLoss = switch (outcome) {
      case (#win) { invest * 0.98 };
      case (#loss) { invest };
    };

    switch (outcome) {
      case (#win) {
        data.capital := data.capital + profitOrLoss;
        data.totalProfit := data.totalProfit + profitOrLoss;
      };
      case (#loss) {
        data.capital := data.capital - invest;
        data.totalLoss := data.totalLoss + invest;
      };
    };

    let trade : Trade = {
      timestamp = Time.now();
      invest;
      outcome;
      profitOrLoss;
    };
    data.trades.add(trade);
  };

  public shared ({ caller }) func resetTradingData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset trading data");
    };
    let data = getOrCreateTradingData(caller);
    data.capital := 0.0;
    data.target := 0.0;
    data.totalProfit := 0.0;
    data.totalLoss := 0.0;
    data.trades.clear();
  };
};
