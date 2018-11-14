properties([
  parameters([
    choice(
      name: 'BUILD_ENV',
      choices: ['Production', 'Staging'],
      description: 'Select build environment'
    ),
    booleanParam(
      name: 'BUILD_NATIVE',
      defaultVaue: false,
      description: 'Build native code or just OTA?'
    ),
    string(
      name: 'BUILD_NUMBER',
      defaultValue: "${(env.BUILD_ID as int) + 1}",
      description: 'Build number?'
    )
  ])
])

node {
  echo "${currentBuild.number} ${currentBuild.id} ${currentBuild.displayName}"

  // def signature = 'new groovy.json.JsonSlurperClassic'
  // org.jenkinsci.plugins.scriptsecurity.scripts.ScriptApproval.get().approveSignature(signature)

  currentBuild.displayName = "#" + params.BUILD_NUMBER
  
  checkout scm

  stage('Prepare') {
    echo "ID ${env.BUILD_ID} ID ${(env.BUILD_ID as int) + 1} NUM ${env.BUILD_NUMBER}"
    echo "${params}"
  }
}
