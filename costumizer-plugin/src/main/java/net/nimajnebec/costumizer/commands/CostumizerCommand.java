package net.nimajnebec.costumizer.commands;

import com.mojang.brigadier.builder.LiteralArgumentBuilder;
import net.minecraft.commands.CommandSourceStack;
import net.nimajnebec.costumizer.Costumizer;
import net.nimajnebec.costumizer.commands.brigadier.BrigadierCommand;

public class CostumizerCommand extends BrigadierCommand {

    @Override
    public void define(LiteralArgumentBuilder<CommandSourceStack> root) {
        root.then(literal("ui").executes(new CostumizerUiCommand()));
    }

}