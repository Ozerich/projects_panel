<input type="hidden" id="pages_count" value="<?= count($model->slider_pages) ?>">
<div class="slider-content">
    <? foreach ($model->slider_pages as $page_num => $page): ?>
        <div class="slider-page" data-id="<?= $page->id ?>" style="display:<?= $page_num > 0 ? 'none' : 'block' ?>">
            <?=$this->renderPartial('//projects/_slider_page', array('page' => $page));?>
        </div>
    <? endforeach; ?>
</div>
<div class="slider-pagination pagination">
    <ul>
        <? foreach ($model->slider_pages as $page_num => $page): ?>
            <li><a data-num="<?=$page_num+1?>" href="#"><?=$page_num + 1?></a></li>
        <? endforeach; ?>
    </ul>
</div>