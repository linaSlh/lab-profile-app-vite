const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email is required.'],
      unique: true,
      

    },
    username: {
      type: String,
      required: [true, 'username is required.'],
      unique: true,
     
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
     campus: {
      type: String,
      enum: [
        'Madrid',
        'Barcelona',
        'Miami',
        'Paris',
        'Berlin',
        'Amsterdam',
        'México',
        'Sao Paulo',
        'Lisbon',
        'Remote',
      ],
      required: true,
    },
    course: {
      type: String,
      enum: ['Web Dev', 'UX/UI', 'Data Analytics', 'Cyber Security'],
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }

);

const User = model("User", userSchema);

module.exports = User;
