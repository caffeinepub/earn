import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Random "mo:core/Random";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type UserId = Text;
  type ReferralCode = Text;

  public type Plan = {
    planId : Nat;
    depositAmount : Nat;
    dailyProfit : Nat;
    durationDays : Nat;
  };

  public type DepositRequest = {
    userId : UserId;
    plan : Plan;
    paymentScreenshot : Storage.ExternalBlob;
    status : { #pending; #approved; #rejected };
    timestamp : Time.Time;
  };

  public type WithdrawalRequest = {
    userId : UserId;
    accountNumber : Text;
    payoutMethod : { #easypaisa; #jazzCash };
    amount : Nat;
    status : { #pending; #approved; #rejected };
    timestamp : Time.Time;
  };

  public type ReferralBonus = {
    rewardTier : Nat;
    rewardAmount : Nat;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    firstName : Text;
    lastName : Text;
    email : Text;
    balance : Nat;
    referralCode : ReferralCode;
    referrers : [ReferralCode];
  };

  module UserProfile {
    public func compareByBalance(a : UserProfile, b : UserProfile) : Order.Order {
      Nat.compare(a.balance, b.balance);
    };
  };

  module ReferralBonus {
    public func compareByRewardAmount(a : ReferralBonus, b : ReferralBonus) : Order.Order {
      Nat.compare(a.rewardAmount, b.rewardAmount);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let depositRequests = Map.empty<Principal, DepositRequest>();
  let withdrawalRequests = Map.empty<Principal, WithdrawalRequest>();

  let activePlans = Set.empty<UserId>();
  let pendingWithdrawalRequests = Set.empty<UserId>();
  let approvedWithdrawals = Set.empty<UserId>();
  let rejectedWithdrawals = Set.empty<UserId>();

  let plan1 : Plan = { planId = 1; depositAmount = 300; dailyProfit = 50; durationDays = 7 };
  let plan2 : Plan = { planId = 2; depositAmount = 700; dailyProfit = 110; durationDays = 7 };
  let plan3 : Plan = { planId = 3; depositAmount = 2000; dailyProfit = 200; durationDays = 12 };
  let plan4 : Plan = { planId = 4; depositAmount = 5000; dailyProfit = 250; durationDays = 30 };
  let rewardTiers : [(Nat, Nat)] = [(3, 150), (5, 300), (10, 800), (50, 4_000)];

  public query ({ caller }) func getAvailablePlans() : async [Plan] {
    [plan1, plan2, plan3, plan4];
  };

  public query ({ caller }) func canWithdraw() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check withdrawal eligibility");
    };
    switch (userProfiles.get(caller)) {
      case (null) { true };
      case (?profile) { profile.balance >= 100 };
    };
  };

  public query ({ caller }) func getMinimumWithdrawalAmount() : async Nat {
    100;
  };

  public query ({ caller }) func getMaximumWithdrawalAmount() : async Nat {
    5000;
  };

  type AccountInfo = {
    accountHolderName : Text;
    accountNumber : Text;
    paymentChannel : Text;
  };

  public query ({ caller }) func getDepositAccountDetails() : async AccountInfo {
    {
      accountHolderName = "Tayyab Raza";
      accountNumber = "03710416136";
      paymentChannel = "Easypaisa";
    };
  };

  public query ({ caller }) func getReferralTiers() : async [(Nat, Nat)] {
    rewardTiers;
  };

  public query ({ caller }) func getAvailableBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check balance");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User is not registered") };
      case (?profile) { profile.balance };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  public shared ({ caller }) func submitDepositRequest(planId : Nat, paymentScreenshot : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit deposit requests");
    };
    let plans = [plan1, plan2, plan3, plan4];
    let matchingPlans = plans.filter(
      func(plan) {
        plan.planId == planId;
      }
    );
    if (matchingPlans.size() == 0) {
      Runtime.trap("Invalid plan " # planId.toText() # ".");
    };
    let plan = matchingPlans[0];

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User is not registered.") };
      case (?profile) {
        let depositRequest : DepositRequest = {
          userId = profile.referralCode;
          plan;
          paymentScreenshot;
          status = #pending;
          timestamp = Time.now();
        };
        depositRequests.add(caller, depositRequest);
      };
    };
  };

  public shared ({ caller }) func submitWithdrawalRequest(account : Text, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit withdrawal requests");
    };
    if (amount < 100 or amount > 5000) {
      Runtime.trap("Invalid withdrawal amount");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Only registered users can submit withdrawal requests.") };
      case (?profile) {
        if (profile.balance < amount) {
          Runtime.trap("Insufficient balance for withdrawal request.");
        };
        let withdrawalRequest : WithdrawalRequest = {
          userId = profile.referralCode;
          accountNumber = account;
          payoutMethod = #easypaisa;
          amount;
          status = #pending;
          timestamp = Time.now();
        };
        withdrawalRequests.add(caller, withdrawalRequest);
        pendingWithdrawalRequests.add(profile.referralCode);
      };
    };
  };

  public query ({ caller }) func getAllDepositRequests() : async [(Principal, DepositRequest)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all deposit requests");
    };
    depositRequests.entries().toArray();
  };

  public query ({ caller }) func getAllWithdrawalRequests() : async [(Principal, WithdrawalRequest)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawal requests");
    };
    withdrawalRequests.entries().toArray();
  };

  public shared ({ caller }) func approveDepositRequest(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve deposit requests");
    };
    switch (depositRequests.get(user)) {
      case (null) { Runtime.trap("Deposit request not found") };
      case (?request) {
        let updatedRequest : DepositRequest = {
          userId = request.userId;
          plan = request.plan;
          paymentScreenshot = request.paymentScreenshot;
          status = #approved;
          timestamp = request.timestamp;
        };
        depositRequests.add(user, updatedRequest);
        activePlans.add(request.userId);
      };
    };
  };

  public shared ({ caller }) func rejectDepositRequest(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject deposit requests");
    };
    switch (depositRequests.get(user)) {
      case (null) { Runtime.trap("Deposit request not found") };
      case (?request) {
        let updatedRequest : DepositRequest = {
          userId = request.userId;
          plan = request.plan;
          paymentScreenshot = request.paymentScreenshot;
          status = #rejected;
          timestamp = request.timestamp;
        };
        depositRequests.add(user, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func approveWithdrawalRequest(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve withdrawal requests");
    };
    switch (withdrawalRequests.get(user)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?request) {
        let updatedRequest : WithdrawalRequest = {
          userId = request.userId;
          accountNumber = request.accountNumber;
          payoutMethod = request.payoutMethod;
          amount = request.amount;
          status = #approved;
          timestamp = request.timestamp;
        };
        withdrawalRequests.add(user, updatedRequest);
        approvedWithdrawals.add(request.userId);
        pendingWithdrawalRequests.remove(request.userId);
        
        switch (userProfiles.get(user)) {
          case (null) {};
          case (?profile) {
            let updatedProfile : UserProfile = {
              firstName = profile.firstName;
              lastName = profile.lastName;
              email = profile.email;
              balance = profile.balance - request.amount;
              referralCode = profile.referralCode;
              referrers = profile.referrers;
            };
            userProfiles.add(user, updatedProfile);
          };
        };
      };
    };
  };

  public shared ({ caller }) func rejectWithdrawalRequest(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject withdrawal requests");
    };
    switch (withdrawalRequests.get(user)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?request) {
        let updatedRequest : WithdrawalRequest = {
          userId = request.userId;
          accountNumber = request.accountNumber;
          payoutMethod = request.payoutMethod;
          amount = request.amount;
          status = #rejected;
          timestamp = request.timestamp;
        };
        withdrawalRequests.add(user, updatedRequest);
        rejectedWithdrawals.add(request.userId);
        pendingWithdrawalRequests.remove(request.userId);
      };
    };
  };
};
