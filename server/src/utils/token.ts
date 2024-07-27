import jwt from 'jsonwebtoken';

export async function generateToken(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY!, { expiresIn: '24h' }, (err, token) => {
      if (err || !token) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

type Payload = {
  id: string;
};

export async function verifyToken(token: string, secret: string): Promise<Payload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, decoded: any) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}
