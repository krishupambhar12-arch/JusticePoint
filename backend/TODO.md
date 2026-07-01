# TODO - Fix backend connection issue

- [x] Fix `backend/routes/userRoutes.js` syntax error: `await is only valid in async functions` (file corruption around line ~312)
- [x] Clean `userRoutes.js`: ensure router handlers only inside routes and exactly one `module.exports = router;` at end
- [x] Fix `userRoutes.js` runtime error: `ReferenceError: auth is not defined` (missing import from middleware/auth)



- [ ] (After syntax fix) update Mongo connection to use env vars in `backend/config/dbConnect.js`
- [ ] Start backend (`npm run dev`) and confirm it boots without crashes
- [ ] Run a quick API test (`node test_api.js` or provided test scripts)

