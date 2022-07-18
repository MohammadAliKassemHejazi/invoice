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
  invoices: {
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
  const updatedInvoicesItems = [...this.invoices.items];

  updatedInvoicesItems.push({
    invoiceId: invoice._id,
  });

  const updatedInvoices = {
    items: updatedInvoicesItems,
  };
  this.invoices = updatedInvoices;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.invoices.items.filter((item) => {
    return item.invoiceId.toString() !== productId.toString();
  });
  this.invoices.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
