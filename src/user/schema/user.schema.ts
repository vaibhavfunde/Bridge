//  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = User & Document;

// @Schema({ timestamps: true }) // automatically adds createdAt and updatedAt
// export class User {
//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   passwordHash: string;

//   @Prop({ required: true })
//   name: string;

//   @Prop({ type: [String], default: ['user'] })
//   roles: string[];

//   @Prop({ default: true })
//   isActive: boolean;

//   @Prop({ type: Date, default: null })
//   lastLogin: Date;
// }

// export const UserSchema = SchemaFactory.createForClass(User);


// @Schema({ timestamps: true })
// export class User {
//   @Prop({ required: true, unique: true, trim: true })
//   username: string;

//   @Prop({ required: true, unique: true, lowercase: true, trim: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ default: false })
//   isVerified: boolean;

//   @Prop({ default: false })
//   isAdmin: boolean;

//   @Prop({ type: [String], default: ['user'] })  // ← new
//   roles: string[];

//   @Prop({ default: true })  // ← new
//   isActive: boolean;

//   @Prop({ type: Date, default: null })  // ← new
//   lastLogin: Date;
// }
// export const UserSchema = SchemaFactory.createForClass(User);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  // @Prop({ default: false })
  // isAdmin: boolean;

  // @Prop({ type: [String], default: ['user'] })
  // roles: string[];

  @Prop({
  type: [String],
  enum: ['admin', 'user'],  // restrict values
  default: ['user'],        // default role
})
roles: string[];


  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLogin: Date;

  


   _id?: Types.ObjectId;

   @Prop({ type: String, default: null })  // <-- NEW
accessToken: string;

}



export const UserSchema = SchemaFactory.createForClass(User);
