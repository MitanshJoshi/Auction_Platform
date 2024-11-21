
import { deleteItem } from "@/store/slices/superAdminSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AuctionItemDelete = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  const handleAuctionDelete = (id) => {
    dispatch(deleteItem(id));
  };

  return (
    <>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white border-gray-300">
          <thead className="bg-gray-800 text-white w-full">
            <tr>
              <th className="w-1/3 py-2">Image</th>
                <th className="w-1/3 py-2">Title</th>
                <th className="w-1/3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {allAuctions.length > 0 ? (
              allAuctions.map((element) => {
                return (
                  <tr key={element._id}>
                    <td className="py-2 px-4 text-center">
                      <img
                        src={element.image?.url}
                        alt={element.title}
                        className="h-12 w-12 ml-[160px] object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">{element.title}</td>
                    <td className="flex items-center py-4 justify-center gap-3">
                      <Link
                        to={`/auction/details/${element._id}`}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-all duration-300"
                      >
                        View
                      </Link>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-all duration-300"
                        onClick={() => handleAuctionDelete(element._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-left text-xl text-sky-600 py-3">
                <td>No Auctions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AuctionItemDelete;