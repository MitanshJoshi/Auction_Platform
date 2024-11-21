import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  return (
    <section className="w-full min-h-screen px-5 pt-20 lg:pl-[320px] flex flex-col justify-start ">
      {loading ? (
        <Spinner />
      ) : (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 bg-white shadow-md rounded-lg">
          <div className="flex flex-col items-center gap-6">
            <img
              src={user.profileImage?.url}
              alt="/imageHolder.jpg"
              className="w-36 h-36 rounded-full border-4 border-gray-200 shadow-sm"
            />

            <div className="w-full space-y-6">
              <h3 className="text-2xl font-semibold text-gray-700">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={user.userName}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="text"
                    defaultValue={user.email}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="number"
                    defaultValue={user.phone}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Address
                  </label>
                  <input
                    type="text"
                    defaultValue={user.address}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue={user.role}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Joined On
                  </label>
                  <input
                    type="text"
                    defaultValue={user.createdAt?.substring(0, 10)}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                    disabled
                  />
                </div>
              </div>
            </div>

            {user.role === "Auctioneer" && (
              <div className="w-full space-y-6">
                <h3 className="text-2xl font-semibold text-gray-700">Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.paymentMetods.bankTransfer.bankName}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Bank Account (IBAN)
                    </label>
                    <input
                      type="text"
                      defaultValue={user.paymentMetods.bankTransfer.bankAccountNumber}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      User Name On Bank Account
                    </label>
                    <input
                      type="text"
                      defaultValue={user.paymentMetods.bankTransfer.bankAccountName}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Easypaisa Account Number
                    </label>
                    <input
                      type="text"
                      defaultValue={user.paymentMetods.razorpay.razorpayAccountNumber}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Paypal Email
                    </label>
                    <input
                      type="text"
                      defaultValue={user.paymentMetods.paypal.paypalEmail}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="w-full space-y-6">
              <h3 className="text-2xl font-semibold text-gray-700">Other User Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.role === "Auctioneer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Unpaid Commissions
                    </label>
                    <input
                      type="text"
                      defaultValue={user.unpaidCommission}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                )}
                {user.role === "Bidder" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Auctions Won
                      </label>
                      <input
                        type="text"
                        defaultValue={user.auctionsWon}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Money Spent
                      </label>
                      <input
                        type="text"
                        defaultValue={user.moneySpent}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                        disabled
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
