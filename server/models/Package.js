const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[a-zA-Z ]{1,50}$/.test(v),
      message: (props) => ({ message: `${props.value} is not a valid name` }),
    },
  },
  max: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v > 0,
      message: (props) => ({ message: `${props.value} is not a valid number` }),
    }
  },
  products: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    required: true,
  }
  // TODO: Mức giới hạn số lượng mỗi sản phẩm trong gói
  // TODO: Mức giới hạn số lượng gói cho mỗi người theo thời gian
  // TODO: Thời gian giới hạn (ngày, tuần, tháng)
});

module.exports = mongoose.model('Package', packageSchema);