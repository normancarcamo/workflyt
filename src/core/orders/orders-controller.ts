import { F } from './orders-types';

export const OrderController:F.controller = (service, validator, helpers) => ({
  getOrders: [
    helpers.validateRights('get orders'),
    helpers.validateInput(validator.getOrders),
    function handler (req, res, next) {
      service.getOrders(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createOrder: [
    helpers.validateRights('create order'),
    helpers.validateInput(validator.createOrder),
    function handler (req, res, next) {
      service.createOrder(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getOrder: [
    helpers.validateRights('get order'),
    helpers.validateInput(validator.getOrder),
    function handler (req, res, next) {
      let order_id = req.params.order;
      let options = req.query;
      service.getOrder(order_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateOrder: [
    helpers.validateRights('update order'),
    helpers.validateInput(validator.updateOrder),
    function handler (req, res, next) {
      let order_id = req.params.order;
      let values = req.body;
      let options = req.query;
      service.updateOrder(order_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteOrder: [
    helpers.validateRights('delete order'),
    helpers.validateInput(validator.deleteOrder),
    function handler (req, res, next) {
      let order_id = req.params.order;
      let options = req.query;
      service.deleteOrder(order_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getJobs: [
    helpers.validateRights('get jobs from order'),
    helpers.validateInput(validator.getJobs),
    function handler (req, res, next) {
      let order_id = req.params.order;
      let options = req.query;
      service.getJobs(order_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getJob: [
    helpers.validateRights('get job from order'),
    helpers.validateInput(validator.getJob),
    function handler (req, res, next) {
      let order_id = req.params.order;
      let job_id = req.params.job;
      let options = req.query;
      service.getJob(order_id, job_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
