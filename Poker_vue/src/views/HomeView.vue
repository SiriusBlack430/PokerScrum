<script>

</script>

<template>
  <div class="menu-container">
      <header>
        <div class="left">
          <a href="/">
            <img src="https://boldworkplanner.com/wp-content/themes/boldworkplannertheme/imgs/logo-bold.svg" alt="logo">
          </a>
        </div>
        <div class="right">
          <ul>
            <li> <a href="login">LOGIN</a></li>
            <li> <a href="register">SIGN UP</a></li>
          </ul>
        </div>
      </header>
  </div>
  <article>
    <div class="info">
      <h1>Scrum Poker for agile development teams</h1>
      <p>Have fun while being productive with our simple and complete tool.</p>
      <div class="button-mod">
        <li> <a href="login">LOGIN</a></li>
      </div>
    </div>
    <div class="img">
      <img src="https://www.reshot.com/preview-assets/illustrations/B9HDTVXC3W/development-team-B9HDTVXC3W-w600.jpg" alt="team">
    </div>
  </article>
</template>

<style>
article{
  width: 80%;
  margin-top: 3rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.info{
  width: 40rem;
  text-align: center;
  margin: auto;
}

.info > h1 {
  font-size: 3rem;
}

.info > .button-mod{
  margin-top: 1rem;
  margin-bottom: 1rem;
}

article> .img{
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>