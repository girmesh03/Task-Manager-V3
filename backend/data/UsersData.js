import mongoose from "mongoose";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

const users = [
  {
    firstName: "Girmachew",
    lastName: "Zewdie",
    position: "Chief Engineer",
    email: "girmazewdei38@gmail.com",
    password: "12345",
    role: "admin",
    isVerified: true,
  },
  {
    firstName: "Terefe",
    lastName: "Wubetu",
    position: "Electrician",
    email: "terefe@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Bisrat",
    lastName: "Wendafirash",
    position: "Electrician",
    email: "bisrat@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Jafar",
    lastName: "Mensur",
    position: "Electrician",
    email: "jafar@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Firesenbet",
    lastName: "Debebe",
    position: "Electrician",
    email: "firesenbet@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Eyob",
    lastName: "Chubud",
    position: "HVAC Technician",
    email: "eyob@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Yohanes",
    lastName: "Yeshitila",
    position: "Plumber",
    email: "yohanes@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Misael",
    lastName: "Teshome",
    position: "Plumber",
    email: "misael@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Zerihun",
    lastName: "Sorsa",
    position: "Plumber",
    email: "zerihun@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Yasin",
    lastName: "Admasu",
    position: "Painter",
    email: "yasin@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Giduma",
    lastName: "Turi",
    position: "Painter",
    email: "giduma@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Sisay",
    lastName: "Lema",
    position: "Painter",
    email: "sisay@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Wakuma",
    lastName: "chimidi",
    position: "Painter",
    email: "wakuma@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Henock",
    lastName: "Tsegaye",
    position: "General Mechanic",
    email: "henock@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Bekele",
    lastName: "Chala",
    position: "Wood Work Technician",
    email: "bekele@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Demisse",
    lastName: "Kebede",
    position: "Civil Work Technician",
    email: "demisse@gmail.com",
    password: "12345",
    isVerified: true,
  },
  {
    firstName: "Feyesa",
    lastName: "Daba",
    position: "Lift Attendant",
    email: "feyesa@gmail.com",
    password: "12345",
    isVerified: true,
  },
];

const insertManyUsers = async () => {
  try {
    // Insert all users without hashing passwords
    const insertedUsers = await User.insertMany(users);

    // update users with hash password
    const result = await Promise.all(
      insertedUsers.map(async (user) => await User.updateOne({ _id: user._id }, { password: await bcrypt.hash(user.password, 10) }, { new: true }))
    );

    console.log(`${result.length} users inserted successfully.`);
  } catch (error) {
    console.error("Error inserting users:", error);
  }
};

// Function to delete all users
const deleteManyUsers = async () => {
  try {
    const result = await User.deleteMany({});
    console.log(`${result.deletedCount} users deleted successfully.`);
  } catch (error) {
    console.error("Error deleting users:", error);
  }
};

export { insertManyUsers, deleteManyUsers };
