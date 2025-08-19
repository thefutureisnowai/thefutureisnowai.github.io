const x = 5; // Number of seconds to timer
const start = Date.now();

function timer(time, message, first=true) {
  if (first) console.log("starting", message);

  if (Date.now() - start  < time * 1000) {
    setTimeout(() => timer(time, message, false), 1000);

  } else {
    console.log('Done!', message);
  }
}

async function asyncTimer(time, message, first=true) {
  if (first) console.log("starting", message);
  if (Date.now() - start  < time * 1000) {
    setTimeout(() => asyncTimer(time, message, false), 1000);
  } else {
    console.log('Done!', message);
  }
}

function promiseTimer(time, message) {
	console.log("starting", message);
	return new Promise(resolve => setTimeout(resolve, 1000 * time));
}

function test1() { // abc, cba
	console.log("test1");
	timer(3, "a");
	timer(2, "b");
	timer(1, "c");
}
async function test2() { // abc, cba
	console.log("test2");
	timer(3, "a");
	timer(2, "b");
	timer(1, "c");
}

async function test3() { // abc, cba
	console.log("test3");
	await asyncTimer(3, "a");
	await asyncTimer(2, "b");
	await asyncTimer(1, "c");
}
async function test4() {
	console.log("test4");
	asyncTimer(3, "a");
	asyncTimer(2, "b");
	asyncTimer(1, "c");
}
async function test5() { // aa bb cc
	console.log("test5");
	await promiseTimer(3, "a");
	console.log("Done! a");
	await promiseTimer(2, "b");
	console.log("Done! b");
	await promiseTimer(1, "c");
	console.log("Done! c");
}
// test1();
// test2();
// test3();
// test4();
test5();
