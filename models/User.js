const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Invoices: {
    items: [
      {
        invoiceId: {
          type: Schema.Types.ObjectId,
          ref: "Invoice",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToInvoices = function (invoice) {
  const updatedInvoicesItems = [...this.Invoices.items];

  updatedInvoicesItems.push({
    invoiceId: invoice._id,
  });

  const updatedInvoices = {
    items: updatedInvoicesItems,
  };
  this.Invoices = updatedInvoices;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
