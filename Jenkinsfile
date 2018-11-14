properties([
  parameters([
    choice(
      name: 'BUILD_ENV',
      choices: ['Staging', 'Production'],
      defaultVaue: 'Staging',
      description: 'Select build environment'
    ),
    booleanParam(
      name: 'BUILD_NATIVE',
      defaultVaue: false,
      description: 'Build native code or just OTA?'
    )
  ])
])

node {
  checkout scm
  stage('Prepare') {
    echo "ID ${env.BUILD_ID} ID ${(env.BUILD_ID as int) + 1} NUM ${env.BUILD_NUMBER}"
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
      sh"""
        git tag ${env.BUILD_ID}-${params.BUILD_ENV == 'Staging' ? 'staging' : 'prod'}-${params.BUILD_NATIVE ? 'native' : 'ota'}
        git push --force --tags https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/duongdev/storelammoc-mobile-app.git
      """
    }
  }
}
