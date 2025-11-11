package com.bookfair.vendor_service.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {


  public static final String STALL_USER_QUEUE = "stall.user.create.queue";
  public static final String STALL_USER_RESPONSE_QUEUE = "stall.user.response.queue";
  public static final String EXCHANGE = "bookfair.exchange";
  public static final String STALL_USER_RESPONSE_ROUTING_KEY = "stall.user.response";
  public static final String STALL_USER_UPDATE_RESPONSE_QUEUE = "stall.user.update.response.queue";
  public static final String STALL_USER_UPDATE_QUEUE = "stall.user.update.queue";
  public static final String STALL_USER_UPDATE_ROUTING_KEY = "stall.user.update";
  public static final String STALL_USER_UPDATE_RESPONSE_ROUTING_KEY = "stall.user.update.response";
  public static final String STALL_USER_GET_QUEUE = "stall.user.get.queue";
  public static final String STALL_USER_GET_RESPONSE_QUEUE = "stall.user.get.response.queue";
  public static final String STALL_USER_GET_ROUTING_KEY = "stall.user.get";
  public static final String STALL_USER_GET_RESPONSE_ROUTING_KEY = "stall.user.get.response";
  public static final String STALL_USER_DELETE_QUEUE = "stall.user.delete.queue";
  public static final String STALL_USER_DELETE_RESPONSE_QUEUE = "stall.user.delete.response.queue";
  public static final String STALL_USER_DELETE_ROUTING_KEY = "stall.user.delete";
  public static final String STALL_USER_DELETE_RESPONSE_ROUTING_KEY = "stall.user.delete.response";

  // --- NEW CONSTANTS FOR RESERVATION QUERY (Request-Reply) ---
  public static final String VENDOR_RESERVATIONS_GET_QUEUE = "vendor.reservations.get.queue";
  public static final String VENDOR_RESERVATIONS_GET_ROUTING_KEY = "vendor.reservations.get";

  // This queue is where the stall-service sends the reply back to the vendor-service
  public static final String VENDOR_RESERVATIONS_REPLY_QUEUE = "vendor.reservations.reply.queue";
  public static final String VENDOR_RESERVATIONS_REPLY_ROUTING_KEY = "vendor.reservations.reply";


  // --- Existing Beans (Unchanged) ---
  @Bean
  public Queue stallUserQueue() {
    return new Queue(STALL_USER_QUEUE, true);
  }

  @Bean
  public Queue stallUserResponseQueue() {
    return new Queue(STALL_USER_RESPONSE_QUEUE, true);
  }

  @Bean
  public Queue stallUserUpdateQueue() {
    return new Queue(STALL_USER_UPDATE_QUEUE, true);
  }

  @Bean
  public Queue stallUserUpdateResponseQueue() {
    return new Queue(STALL_USER_UPDATE_RESPONSE_QUEUE, true);
  }

  @Bean
  public TopicExchange exchange() {
    return new TopicExchange(EXCHANGE);
  }

  // ... existing Binding Beans (stallUserResponseBinding, stallUserUpdateBinding, etc.) ...
  // (Assuming you will keep the rest of the existing binding beans)

  @Bean
  public MessageConverter jasonMessageConverter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(jasonMessageConverter());
    return rabbitTemplate;
  }

  @Bean
  public Queue stallUserGetQueue() {
    return new Queue(STALL_USER_GET_QUEUE, true);
  }

  @Bean
  public Queue stallUserGetResponseQueue() {
    return new Queue(STALL_USER_GET_RESPONSE_QUEUE, true);
  }

  @Bean
  public Binding stallUserGetBinding(Queue stallUserGetQueue, TopicExchange exchange) {
    return BindingBuilder.bind(stallUserGetQueue).to(exchange)
            .with(STALL_USER_GET_ROUTING_KEY);
  }

  @Bean
  public Binding stallUserGetResponseBinding(Queue stallUserGetResponseQueue,
                                             TopicExchange exchange) {
    return BindingBuilder.bind(stallUserGetResponseQueue).to(exchange)
            .with(STALL_USER_GET_RESPONSE_ROUTING_KEY);
  }

  @Bean
  public Queue stallUserDeleteQueue() {
    return new Queue(STALL_USER_DELETE_QUEUE, true);
  }

  @Bean
  public Queue stallUserDeleteResponseQueue() {
    return new Queue(STALL_USER_DELETE_RESPONSE_QUEUE, true);
  }

  @Bean
  public Binding stallUserDeleteBinding(Queue stallUserDeleteQueue, TopicExchange exchange) {
    return BindingBuilder.bind(stallUserDeleteQueue).to(exchange)
            .with(STALL_USER_DELETE_ROUTING_KEY);
  }

  @Bean
  public Binding stallUserDeleteResponseBinding(Queue stallUserDeleteResponseQueue,
                                                TopicExchange exchange) {
    return BindingBuilder.bind(stallUserDeleteResponseQueue).to(exchange)
            .with(STALL_USER_DELETE_RESPONSE_ROUTING_KEY);
  }

  // --- NEW BEANS FOR RESERVATION QUERY ---

  // 1. The Queue where vendor-service sends the request (Listened to by stall-service)
  @Bean
  public Queue vendorReservationsGetQueue() {
    return new Queue(VENDOR_RESERVATIONS_GET_QUEUE, true);
  }

  // 2. The Queue where vendor-service expects the reply (Listened to by vendor-service)
  @Bean
  public Queue vendorReservationsReplyQueue() {
    return new Queue(VENDOR_RESERVATIONS_REPLY_QUEUE, true);
  }

  // 3. Binding for the Request (Vendor -> Stall)
  @Bean
  public Binding vendorReservationsGetBinding(Queue vendorReservationsGetQueue, TopicExchange exchange) {
    return BindingBuilder.bind(vendorReservationsGetQueue).to(exchange)
            .with(VENDOR_RESERVATIONS_GET_ROUTING_KEY);
  }

  // 4. Binding for the Reply (Stall -> Vendor)
  @Bean
  public Binding vendorReservationsReplyBinding(Queue vendorReservationsReplyQueue, TopicExchange exchange) {
    return BindingBuilder.bind(vendorReservationsReplyQueue).to(exchange)
            .with(VENDOR_RESERVATIONS_REPLY_ROUTING_KEY);
  }
}