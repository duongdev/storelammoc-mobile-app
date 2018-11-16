properties([
  parameters([
    choice(
      name: 'BUILD_ENV',
      choices: ['Staging', 'Production'],
      defaultValue: 'Staging',
      description: 'Select build environment'
    ),
    booleanParam(
      name: 'BUILD_NATIVE',
      defaultValue: true,
      description: 'Build native code or just OTA?'
    )
  ])
])

node {
  checkout scm
  stage('Prepare') {
    echo "${params}"

    sh"""
      git config --global user.email "dustin.do95@gmail.com"
      git config --global user.name "Dương Đỗ"
    """
  }

  stage('Mirror') {
    withCredentials([usernamePassword(credentialsId: 'github-duongdev', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
      if (params.BUILD_ENV == 'Production') {
        sh("git checkout master")
      }
      def GIT_REV = "${sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()}"
      def TAG_NAME = "${GIT_REV}-${params.BUILD_ENV == 'Staging' ? 'staging' : 'production'}-${params.BUILD_NATIVE ? 'native' : 'ota'}"

      sh"""
        git tag ${TAG_NAME}
        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/duongdev/storelammoc-mobile-app.git ${TAG_NAME}
        git push -f https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/duongdev/storelammoc-mobile-app.git
      """
    }
  }
}
