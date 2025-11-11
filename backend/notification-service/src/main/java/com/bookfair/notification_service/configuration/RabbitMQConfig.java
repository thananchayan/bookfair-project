package com.bookfair.notification_service.configuration;

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

  // Queue name constant
  public static final String USER_CREATION_QUEUE = "user.creation.queue";
  public static final String USER_EXCHANGE = "user.exchange";
  public static final String USER_CREATED_ROUTING_KEY = "user.created";

  // Define Queue - stores messages until consumed
  @Bean
  public Queue userCreationQueue() {
    return new Queue(USER_CREATION_QUEUE, true); // durable=true (survives broker restart)
  }

  // Define Exchange - routes messages to queues
  @Bean
  public TopicExchange userExchange() {
    return new TopicExchange(USER_EXCHANGE);
  }

  // Bind Queue to Exchange with routing key
  @Bean
  public Binding userCreationBinding(Queue userCreationQueue, TopicExchange userExchange) {
    return BindingBuilder.bind(userCreationQueue)
        .to(userExchange)
        .with(USER_CREATED_ROUTING_KEY);
  }

  // JSON converter for serialization/deserialization
  @Bean
  public Jackson2JsonMessageConverter messageConverter() {
    return new Jackson2JsonMessageConverter();
  }

  // Configure RabbitTemplate with JSON converter
  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate template = new RabbitTemplate(connectionFactory);
    template.setMessageConverter(messageConverter());
    return template;
  }
}
