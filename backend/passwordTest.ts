import * as bcrypt from 'bcrypt';

async function encryptPassword(password: string) {
	const saltRounds = 9;
	const hash = await bcrypt.hash(password, saltRounds);
	return hash;
}

async function verifyPassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}

async function testModule() {
	const hash = await encryptPassword("password");
	console.log(hash);
	const ver = await verifyPassword("password", hash);
	console.log(ver);
}

testModule().then();