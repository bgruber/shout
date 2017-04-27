FROM node

ADD . /code
WORKDIR /code
RUN ["npm", "install"]

RUN ["npm", "run", "build"]

EXPOSE 8081

CMD ["npm", "start"]
