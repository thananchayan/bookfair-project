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
  public static final String STALL_USER_RESPONSE_QUEUE = "stall.user.response.queue"; // for receiving response
  public static final String STALL_USER_UPDATE_QUEUE = "stall.user.update.queue";
  public static final String STALL_USER_UPDATE_RESPONSE_QUEUE = "stall.user.update.response.queue";


  public static final String EXCHANGE = "bookfair.exchange"; // for both request and response
  public static final String STALL_USER_RESPONSE_ROUTING_KEY = "stall.user.response"; // for receiving response
  public static final String STALL_USER_UPDATE_ROUTING_KEY = "stall.user.update";
  public static final String STALL_USER_UPDATE_RESPONSE_ROUTING_KEY = "stall.user.update.response";


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

  @Bean
  public Binding stallUserResponseBinding(Queue stallUserResponseQueue, TopicExchange exchange) {
    return BindingBuilder.bind(stallUserResponseQueue).to(exchange)
        .with(STALL_USER_RESPONSE_ROUTING_KEY);
  }

  @Bean
  public Binding stallUserUpdateBinding(Queue stallUserUpdateQueue, TopicExchange exchange) {
    return BindingBuilder.bind(stallUserUpdateQueue).to(exchange)
        .with(STALL_USER_UPDATE_ROUTING_KEY);
  }

  @Bean
  public Binding stallUserUpdateResponseBinding(Queue stallUserUpdateResponseQueue,
      TopicExchange exchange) {
    return BindingBuilder.bind(stallUserUpdateResponseQueue).to(exchange)
        .with(STALL_USER_UPDATE_RESPONSE_ROUTING_KEY);
  }

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

}
