import { generateEncryption,sendEmail } from '../../common/utils/index.js';
import { generateHash, compareHash } from '../../common/utils/security/hash.js';
import { BadRequestException, createLoginCredentials, ConflictException, NotFoundException, emailTemplate, createNumberOtp } from '../../common/utils/index.js';
import { User } from "../../modules/users/users.model.js";
import { OAuth2Client } from 'google-auth-library';
import { providerEnum } from '../../common/enums/index.js';
import { create, findOne } from '../../DB/models/DB.service.js';
import { set,get } from '../../common/services/redis.service.js';
import {otpkey} from '../../common/services/index.js';



export const signUp = async (userData) => {
    const existingUser = await findOne({
        model: User,
        filter: { email: userData.email }
    });

    if (existingUser) {
        ConflictException({ message: "Email already exists" });
    }

    const data = {
        ...userData,
        password: await generateHash(userData.password),
        phone: await generateEncryption(userData.phone),
    };

    let newUser;
    try {
        newUser = await User.create(data);
    } catch (error) {
        if (error?.code === 11000) {
            throw ConflictException({ message: "Email already exists", extra: error });
        }
        throw error;
    }

    const code = await createNumberOtp();
    await set({key:otpkey(data.email),
               value: await generateHash(`${code}`),
               ttl: 12000
            });

     await sendEmail({
        to:data.email,
        subject: "Comfirm ur Email",
        html:emailTemplate({code,title:"comfirm_Email"}),
     });

    return newUser;
};


export const confirmEmail = async (inputs) => {
  const { email, otp } = inputs;

  const account = await findOne({
    model: User,
    filter: {
      email,
      comfirmEmail: { $exists: false },
      provider: providerEnum.system,
    },
  });

  if (!account) {
    throw NotFoundException({ message: "Fail to find matching account" });
  }

  const hashOtp = await get(otpkey(email));

  if (!hashOtp) {
    throw NotFoundException({ message: "Expired OTP" });
  }

  const isValid = await compareHash(`${otp}`, hashOtp);

  if (!isValid) {
    throw ConflictException({ message: "Invalid OTP" });
  }

  account.comfirmEmail = new Date();
  await account.save();

  return account;
};



export const login = async (userData, issuer) => {
        const { email, password } = userData;
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const user = await findOne({ model: User, filter: { email, provider: providerEnum.system } });
        if (!user) {
            throw new Error('Invalid email');
        }
        const compare = await compareHash(password, user.password);
        if (!compare) {
            throw new Error('Invalid password');
        }
        return createLoginCredentials(user, issuer)
 
};


const verifyGoogleAccount = async (idToken) => {

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: "514097152595-786l7ioh39om7ci0af8jkuujauh2dgma.apps.googleusercontent.com",

    });
    const payload = ticket.getPayload();
    if (!payload?.email_verified) {
        BadRequestException({ message: "Google account email not verified" });
    }
    return payload;
};



export const signUpWithGmail = async (idToken, issuer) => {

    const payload = await verifyGoogleAccount(idToken);
    const checkExist = await findOne({
        model: User,
        filter: { email: payload.email }
    });

    if (checkExist) {
        if (checkExist.provider != providerEnum.Google) {
            ConflictException({ message: "Invalid provider" });
        }
        return { status: 200, credentials: await loginWithGmail(idToken, issuer) };
    }

    const newUser = await create({
        model: User,
        data: {
            fullName: payload.name,
            //password: await generateHash(Math.random().toString()),
            email: payload.email,
            profilePicture: payload.picture,
            provider: providerEnum.Google
        },
    });

    return {
        status: 201,
        credentials: await createLoginCredentials(newUser, issuer)
    };
};


export const loginWithGmail = async (idToken, issuer) => {

    const payload = await verifyGoogleAccount(idToken);

    const user = await findOne({
        model: User,
        filter: { email: payload.email, provider: providerEnum.Google }
    });

    if (!user) {
        NotFoundException({ message: "Not Found account" });
    }
    return await createLoginCredentials(user, issuer)
}

















/*

{
  iss: 'https://accounts.google.com',
  azp: '514097152595-786l7ioh39om7ci0af8jkuujauh2dgma.apps.googleusercontent.com',
  aud: '514097152595-786l7ioh39om7ci0af8jkuujauh2dgma.apps.googleusercontent.com',
  sub: '101478477678726503167',
  email: 'amr.e77at@gmail.com',
  email_verified: true,
  nbf: 1774915903,
  name: 'Amr Ezzat',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocKEhwz_OMnKihobU_E9jDwDN64ryG8WZV7YO3dOJC3uDDvpQw=s96-c',
  given_name: 'Amr',
  family_name: 'Ezzat',
  iat: 1774916203,
  exp: 1774919803,
  jti: '647422490a24e4ef3c6f606988af30ca1e14e1be'
}



*/
