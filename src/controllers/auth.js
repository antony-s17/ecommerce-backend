import { insertUser, loginUser, selectUser } from "../services/auth.js";
import CError, { Selector } from "../misc/errors.js";

const createUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    const response = await insertUser({ username, email, password }, 'USER');
    if (!response.ok){
        if (response.data == 'P2002') {
            return next(new CError(Selector.USER_EXIST));
        }
        return next(new CError(Selector.BAD_ERROR));
    }
    return res.status(201).json({
        ok:true,
        data: response.data
    })
}

const createUserAdmin = async (req, res, next) => {
    const { username, email, password } = req.body;
    const response = await insertUser({ username, email, password}, 'ADMIN');
    if (!response.ok){
        if (response.data == 'P2002') {
            return next(new CError(Selector.USER_EXIST));
        }
        return next(new CError(Selector.BAD_ERROR));
    }
    return res.status(201).json({
        ok:true,
        data: response.data
    })
}

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const response = await loginUser( email, password);

  if (!response.ok) {
    if (
      response.data === Selector.WRONG_CRED
    ) {
      return next(
        new CError(
          Selector.WRONG_CRED
        )
      );
    }
    return next(
      new CError(
        Selector.BAD_ERROR
      )
    );
  }

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("access_token", response.data, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 1000
  });

  return res.status(200).json({
    ok: true
  });
};

const logout = async(req, res, next) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("access_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
    });
    return res.status(200).json(
        {
            ok: true
        }
    )
}

export {
    createUser,
    createUserAdmin,
    login,
    logout
}