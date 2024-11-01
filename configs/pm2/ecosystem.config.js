module.exports = {
  apps: [
    {
      name: "scheduler",
      script: "node",
      args: "ace scheduler:run",
      interpreter: "none",
      watch: false,
      max_memory_restart: "256M",
      instances: 1,
    },
  ],
}
