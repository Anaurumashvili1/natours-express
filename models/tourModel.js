const mongoose = require('mongoose');
const slugify = require('slugify');
// const Review = require('./reviewModel');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      maxLength: [40, "name can't have more than 40 chars"],
      minLength: [2, "name can't have less than 2 chars"],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
    },
    slug: {
      type: String,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty must be easy,medium or difficult',
      },
    },
    price: { type: Number, required: [true, 'price is required'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return this.price > val;
        },
        message: `discount price {VALUE} must be less than regular price `,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'description is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'cover image is required'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
    startLocation: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { toJSON: { virtuals: true }, toObjects: { virtuals: true } }
);
toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' });
toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//virtual populate
toursSchema.virtual('durationInWeeks').get(function () {
  return Math.ceil(this.duration / 7);
});
//document middleware
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// toursSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//query middleware

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
toursSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start}`);
  next();
});
// aggregation middleware
toursSchema.pre('aggregate', function (next) {
  this.pipeline().push({ $match: { secretTour: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', toursSchema);
module.exports = Tour;
