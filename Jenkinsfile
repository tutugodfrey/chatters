// add configuration with declarative pipeline

pipeline {
  agent any
  parameters {
    string(name: 'Container', defaultValue: 'chatters', description: 'Name of the container to create')
    string(name: 'Image', defaultValue: 'chatters', description: 'Name of the image to be created')
    string(name: 'Repo', defaultValue: "${env.DOCKER_USER}", description: 'Docker hub username')
    string(name: 'Port', defaultValue: env.APP_PORT, description: 'port to run the app')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Remove previous image') {
      steps {
        sh "docker rmi -f ${params.Repo}/${params.Image} || true"
      }
    }

    stage('Dockerize app') {
      steps {
        sh "docker build -t ${params.Repo}/${params.Image}:latest ."
      }
    }

    stage('Push image to dockerhub') {
      steps {
        sh "docker push ${params.Repo}/${params.Image}:latest"
      }
    }

    stage('Deploy') {
      steps {
        sh "docker container stop ${params.Container} || true"
        sh "docker container rm ${params.Container} || true"
        sh """docker run \
          -d --env DATABASE_URL=${env.DATABASE_URL} \
          --env APP_PORT=${params.Port} \
          -p ${params.Port}:${params.Port} \
          --name ${params.Container} \
          ${params.Repo}/${params.Image}:latest"""
      }
    }
  }
}
