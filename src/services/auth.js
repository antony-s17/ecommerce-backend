import { compare } from "../utils/utils.js";
import { prisma } from "../db/config.js"
import CError, { Selector } from "../misc/errors.js";
import { cleanData, encrypt } from "../utils/utils.js"
import { sign } from "../utils/jwt.js";

const attributes = ["id", "password", "role", "createdAt", "updatedAt"];

const insertUser = async (user, role) => {
    try {
        const hashedpassword = await encrypt(user.password);
        const newUser = await prisma.user.create({ data: {...user, role, password: hashedpassword} })
        return {
            ok: true,
            data: cleanData(...attributes)(newUser)
        }
    } catch (error) {
        return {
            ok: false,
            data: error.code
        }
    }
}

import { compare } from "bcrypt";
import { prisma } from "../db/config.js";
import { sign } from "../utils/jwt.js";
import { Selector } from "../misc/errors.js";

const loginUser = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        password: true,
        role: true,
      },
      where: {
        email,
      },
    });

    if (!user) {
      return {
        ok: false,
        data: Selector.WRONG_CRED,
      };
    }

    const areEqual = await compare(
      password,
      user.password
    );

    if (!areEqual) {
      return {
        ok: false,
        data: Selector.WRONG_CRED,
      };
    }

    const token = sign({
      id: user.id,
      email,
      role: user.role,
    });

    return {
      ok: true,
      data: token,
    };

  } catch (error) {
    console.error("LOGIN SERVICE ERROR:", error);

    return {
      ok: false,
      data: Selector.BAD_ERROR,
    };
  }
};

const selectUser = async (id) => {
    try {
        const user = await prisma.user.findUnique({where: { id }});
        if (!user) {
            throw new Error("Not found user")
        }
        return {
            ok: true,
            data: cleanData(...attributes)(user)
        }
    } catch (error) {
        return {
            ok: false
        }
    }
}
    
export {
    insertUser,
    loginUser,
    selectUser
}