const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
// const tour = tours.find((t) => t.id === Number(req.params.id));
// if (!tour) {
//   return res.status(404).json({ status: 'fail', message: 'invalid id' });
// }
//   next();
// };
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    //build query
    //filter query

    let queryString = JSON.stringify(req.query);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/,
      (match) => `$${match}`
    );
    const queryObj = JSON.parse(queryString);
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let query = Tour.find(queryObj);

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else query.sort('-createdAt');

    //fields limit
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = page * limit - limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const tourNumber = await Tour.countDocuments();
      if (skip >= tourNumber) {
        throw new Error('page does not exist');
      }
    }

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getTourById = async (req, res) => {
  // const tour = tours.find((t) => t.id === Number(req.params.id));
  // console.log(req.body);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
  try {
    const tourById = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: { tour: tourById },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: {
        message: `tour ${deletedTour.name} deleted `,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'missing name or price' });
//   }
//   next();
// };
