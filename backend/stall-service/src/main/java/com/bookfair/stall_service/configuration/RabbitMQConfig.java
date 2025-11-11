package com.bookfair.stall_service.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

  // --- Existing Constants ---
  public static final String STALL_USER_QUEUE = "stall.user.create.queue";
  public static final String STALL_USER_RESPONSE_QUEUE = "stall.user.response.queue";
  public static final String STALL_USER_DELETE_QUEUE = "stall.user.delete.queue";
  public static final String STALL_USER_DELETE_RESPONSE_QUEUE = "stall.user.delete.response.queue";
  public static final String EMAIL_NOTIFICATION_QUEUE = "email.notification.queue";
  public static final String EMAIL_NOTIFICATION_ROUTING_KEY = "email.notification";
  public static final String EXCHANGE = "bookfair.exchange";
  public static final String STALL_USER_ROUTING_KEY = "stall.user.create";
  public static final String STALL_USER_RESPONSE_ROUTING_KEY = "stall.user.response";
  public static final String STALL_USER_DELETE_ROUTING_KEY = "stall.user.delete";
  public static final String STALL_USER_DELETE_RESPONSE_ROUTING_KEY = "stall.user.delete.response";

  // --- NEW CONSTANTS FOR RESERVATION QUERY (Request-Reply with vendor-service) ---
  // The queue where vendor-service sends the reservation query (stall-service listens here)
  public static final String VENDOR_RESERVATIONS_GET_QUEUE = "vendor.reservations.get.queue";
  public static final String VENDOR_RESERVATIONS_GET_ROUTING_KEY = "vendor.reservations.get";

  // The routing key where stall-service sends the reservation data reply back
  public static final String VENDOR_RESERVATIONS_REPLY_ROUTING_KEY = "vendor.reservations.reply";


  // --- Existing Beans (Unchanged) ---
  @Bean
  public TopicExchange exchange() {
    return new TopicExchange(EXCHANGE);
  }

  @Bean
  public Queue stallUserQueue() {
    return new Queue(STALL_USER_QUEUE, true);
  }

  @Bean
  public Queue stallUserResponseQueue() {
    return new Queue(STALL_USER_RESPONSE_QUEUE, true);
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
  public Queue emailNotificationQueue() {
    return new Queue(EMAIL_NOTIFICATION_QUEUE, true);
  }

  @Bean
  public Binding stallUserBinding(Queue stallUserQueue, TopicExchange exchange) {
    return BindingBuilder.bind(stallUserQueue).to(exchange).with(STALL_USER_ROUTING_KEY);
  }

  @Bean
  public Binding stallUserResponseBinding(Queue stallUserResponseQueue, TopicExchange exchange) {
    return BindingBuilder.bind(stallUserResponseQueue).to(exchange)
            .with(STALL_USER_RESPONSE_ROUTING_KEY);
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

  @Bean
  public Binding emailNotificationBinding(Queue emailNotificationQueue, TopicExchange exchange) {
    return BindingBuilder.bind(emailNotificationQueue).to(exchange)
            .with(EMAIL_NOTIFICATION_ROUTING_KEY);
  }

  @Bean
  public Jackson2JsonMessageConverter messageConverter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(messageConverter());
    return rabbitTemplate;
  }

  // --- NEW BEANS FOR RESERVATION QUERY LISTENER ---

  // 1. The Queue where stall-service listens for reservation queries (from vendor-service)
  @Bean
  public Queue vendorReservationsGetQueue() {
    return new Queue(VENDOR_RESERVATIONS_GET_QUEUE, true);
  }

  // 2. Binding for the Request (Stall-Service listens on this queue via its routing key)
  @Bean
  public Binding vendorReservationsGetBinding(Queue vendorReservationsGetQueue, TopicExchange exchange) {
    return BindingBuilder.bind(vendorReservationsGetQueue).to(exchange)
            .with(VENDOR_RESERVATIONS_GET_ROUTING_KEY);
  }
}