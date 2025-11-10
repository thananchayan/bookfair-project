package com.bookfair.reservation_service.configuration;

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

  public static final String EMAIL_NOTIFICATION_QUEUE = "email.notification.queue";
  public static final String EMAIL_NOTIFICATION_ROUTING_KEY = "email.notification";
  public static final String EXCHANGE = "bookfair.exchange";

  @Bean
  public Queue emailNotificationQueue() {
    return new Queue(EMAIL_NOTIFICATION_QUEUE, true);
  }

  @Bean
  public TopicExchange exchange() {
    return new TopicExchange(EXCHANGE);
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
}
